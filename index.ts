const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

const mongoUrl = config.get("mongoUrl");

app.use("/api/auth", require("./routes/auth.route"));

const startServer = async () => {
  try {
    await mongoose.connect(mongoUrl);

    app.listen(6000, () => {
      console.log("server started");
    })
  } catch(err) {
    console.log("Server Error", err);
    process.exit(1);
  } 
}

startServer();