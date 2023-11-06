var express = require("express");
var router = express.Router();
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

router.post("/", (req, res) => {
  const { spawn } = require("child_process");

  // Replace 'your_main.js' with the path to your Node.js project file.

  const scriptPath = "../gcodeScript/main.js"; // Replace with the actual path to your script
  const scriptArgs = ["-f", "result.svg", "-o", "result.gcode"]; // Replace with your script's parameters

  const projectProcess = spawn("node", [scriptPath, ...scriptArgs]);

  projectProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  projectProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  projectProcess.on("close", (code) => {
    const filePath = "../api/gcode/result.gcode";

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return res.status(500).send("Error reading the file");
      }
      res.status(200).json({ result: data });
    });

    console.log(`Child process exited with code ${code}`);
  });
});

module.exports = router;
