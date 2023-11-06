var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var generateImageRoute = require("./routes/generateImage");
var svg2gcode = require("./routes/svg2gcode");
var svgSVG = require("./routes/saveSVG");
var runGCode = require("./routes/runGCode");
var convertToSVG = require("./routes/convertSVG");
var deleteFiles = require("./routes/deleteFiles");
var voiceInput = require("./routes/voiceInput");

var app = express();

app.use(express.json({ limit: "100mb" })); // Change '10mb' to an appropriate limit

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/generateImage", generateImageRoute);
app.use("/svg2gcode", svg2gcode);
app.use("/saveSVG", svgSVG);
app.use("/runGCode", runGCode);
app.use("/convertToSVG", convertToSVG);
app.use("/deleteFiles", deleteFiles);
app.use("/voiceInput", voiceInput);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
