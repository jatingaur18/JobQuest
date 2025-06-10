const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();
require('dotenv').config();
const UI_URL = process.env.UI_URL;

router.get('/', (req, res) => {
  const roomId = nanoid(10); // e.g. 'JtQnVZxK9Q'
  res.json({ roomId, link: `${UI_URL}/meeting/${roomId}` });
});

module.exports = router;
