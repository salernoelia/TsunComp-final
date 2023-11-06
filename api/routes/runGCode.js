var express = require("express");
var router = express.Router();
const { spawn } = require("child_process");

router.post("/", (req, res) => {
  const pythonProcess = spawn("python", ["python/runGCode.py"]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python script stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code === 0) {
      res.status(200).json({ result: "GCode running" });
    } else {
      res.status(500).json({ message: "Error: GCode not running" });
    }
  });
});

module.exports = router;
