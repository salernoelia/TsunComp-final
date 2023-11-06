var express = require("express");
var router = express.Router();

let storedData = null;

router.post("/send", (req, res) => {
  const requestBody = req.body; // This will contain the parsed JSON from the request body
  console.log("Received POST request body:", requestBody);
  res.send("Request body received");

  storedData = requestBody;
});

router.get("/get", (req, res) => {
  if (storedData) {
    // Send the stored data to the second frontend
    res.json(storedData);
    res.send(JSON.stringify(storedData));
  } else {
    res.status(404).json({ message: "Data not found" });
  }
});

module.exports = router;
