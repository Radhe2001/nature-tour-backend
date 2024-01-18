const mongoose = require("mongoose");
require("dotenv").config();


mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rq4sy0y.mongodb.net/naturetour`
  )
  .then((res) => console.log("db connected"))
  .catch((err) => console.log(err));