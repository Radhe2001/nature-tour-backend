const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const admin = require("./routes/router");
const user = require("./routes/userRouter");

const app = express();

// middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/admin", admin);
app.use("/user", user);

const PORT = process.env.PORT || 3000;

app.post("/", (req, res) => {
  res.json("<center><h1>Server is up and running</h1></center>");
});

app.listen(PORT, () => {
  console.log("app is listening on port " + PORT);
});
