const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use("/api/auth", require("./routes/auth.route"));

const startServer = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin:1479314ade777@chat.h9htg4s.mongodb.net/?retryWrites=true&w=majority");

    app.listen(6000, () => {
      console.log("server started");
    })
  } catch(err) {
    console.log("Server Error", err);
    process.exit(1);
  } 
}

startServer();