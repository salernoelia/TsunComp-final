var express = require("express");
var router = express.Router();

/* GET home page. */
router.post("/", async (req, res) => {
  try {
    const resp = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.question }],
    });

    res.status(200).json({ message: resp.data.choices[0].message.content });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;
