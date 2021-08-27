const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connectDB = require("./utils/db");
const path = require("path");
require("dotenv").config();

// import UserRoute
const UserRoute = require("./routes/user");

// connect mongodb
connectDB();

const app = express();

// to log which api is hit
app.use(morgan("dev"));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", UserRoute);
app.get("/", (req, res) => res.status(200).send("Yes its working"));

const PORT = process.env.PORT || 5500;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
