var express = require("express");
var router = express.Router();
const { spawn } = require("child_process");

router.post("/", (req, res) => {
  var { prompt } = req.body;

  // spawn new child process to call the python script
  const python = spawn("python", [
    "python/generate_image.py",
    JSON.stringify(prompt),
  ]);

  let pythonOutput = "";
  let pythonError = "";

  // collect data from script
  python.stdout.on("data", (data) => {
    pythonOutput += data.toString();
  });

  python.stderr.on("data", (data) => {
    pythonError += data.toString();
  });

  python.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code === 0) {
      res.status(200).json({ result: pythonOutput });
    } else {
      res.status(500).json({ message: "Image generation failed" });
    }
  });
});

module.exports = router;
