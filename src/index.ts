const express = require("express");
const http = require("http");
const config = require("config");
const mongoose = require("mongoose");

const app = express();
const expressWs = require('express-ws')(app);

const mongoUrl = config.get("mongoUrl");

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/dialog", require("./routes/dialog.route"));
app.use("/api/message", require("./routes/message.route"));

const startServer = async () => {
  try {
    await mongoose.connect(mongoUrl);

    app.listen(6000, () => {
      console.log("server started");
    });
  } catch (err) {
    console.log("Server Error", err);
    process.exit(1);
  }
};

startServer();
