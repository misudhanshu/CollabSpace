const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        success: false,
        message: `Token not provided!`,
      });
    }

    try {
      if (accessToken) {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        return next();
      }
    } catch (error) {
      if (error.name !== "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: `Invalid access token!`,
        });
      }
    }

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: `Access token expired and refresh token not provided!`,
      });
    }

    const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    
    const newAccessToken = jwt.sign(
      { id: decodedRefresh.userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 60 * 1000,
    });

    req.user = { id: decodedRefresh.userId };
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    res.status(500).json({
      success: false,
      message: `Internal server error!`,
    });
  }
};

module.exports = authMiddleware;
