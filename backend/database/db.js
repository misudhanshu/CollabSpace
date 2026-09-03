require("dotenv").config();
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const response = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Database connected successfully"))
      .catch((error) => console.log("Error: ", error));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
