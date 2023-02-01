const express = require("express");
const http = require("http");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const expressWs = require('express-ws')(app);

const mongoUrl: string = config.get("mongoUrl");

app.use(express.json());
app.use(cors());
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/dialog", require("./routes/dialog.route"));
app.use("/api/message", require("./routes/message.route"));
app.use("/api/users", require("./routes/users.route"));

const startServer = async () => {
  try {
    await mongoose.connect(mongoUrl);

    app.listen(config.get("port"), () => {
      console.log("server started");
    });
  } catch (err) {
    console.log("Server Error", err);
    process.exit(1);
  }
};

startServer();
