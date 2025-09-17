
// Import Required Modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const notifier = require("node-notifier");
const dotenv = require("dotenv");
dotenv.config({ path: "/.env"});

const path = require("path");


const app = express();



// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
    res.json({ message: "MU Result App Backend is Running!" });
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const resultRoutes = require("./routes/resultRoutes");

//Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/results", resultRoutes);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  res.status(404).json({
    code: 404,
    status: "Not found",
    message: `Can not find ${fullUrl} on this server`,
  });
  next();
}
);
// Global Error Handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
