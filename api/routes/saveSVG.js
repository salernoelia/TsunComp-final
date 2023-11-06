var express = require("express");
var router = express.Router();
const { spawn } = require("child_process");

router.post("/", (req, res) => {
  var data = req.body;
  const svgImage = data.svgData;

  // spawn new child process to call the python script
  const pythonProcess = spawn("python", [
    "python/saveSVG.py",
    "./svg/result.svg",
  ]);

  pythonProcess.stdin.write(svgImage);
  pythonProcess.stdin.end();

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python script stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code === 0) {
      res.status(200).json({ result: "SVG saved" });
    } else {
      res.status(500).json({ message: "Error: SVG not saved" });
    }
  });
});

module.exports = router;
