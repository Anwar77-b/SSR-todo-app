const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const User = require("./Models/UserModel");

const DB = process.env.DB.replace("<password>", process.env.DBPASSWORD);

mongoose.connect(DB).then(async () => {
  console.log("connected to the database successfuly");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
