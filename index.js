const cors = require("cors");
const express = require("express");
const credenlists = require("./key.json");
const dotenv = require("dotenv").config();

const app = express();

const UrlRouter = require("./routes/UrlRouter");
const imgRouter = require("./routes/imgRouter");

// const upload = multer({ storage });
//server port
app.use(express.json());
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

//intialize
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(UrlRouter);
app.use(imgRouter);

// not found middleware
app.use((req, res) => {
  res.status(404).json({ message: "page not found" });
});

//error middleware
app.use((error, req, res, next) => {
  res.status(500).json({ message: error + "" });
});
