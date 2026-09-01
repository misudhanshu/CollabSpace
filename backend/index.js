require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const connectToDatabase = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const usersRoutes = require("./routes/usersRoutes");
const tasksRoutes = require("./routes/taskRoutes");

connectToDatabase();

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/organizations", organizationRoutes);
app.use("/organizations/:organizationId/workspace", workspaceRoutes);
app.use("/users", usersRoutes);
app.use("/organizations/:organizationId/workspace/:workspaceId/tasks", tasksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
