const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();

router.get('/', (req, res) => {
  const roomId = nanoid(10); // e.g. 'JtQnVZxK9Q'
  res.json({ roomId, link: `https://localhost:5173/meeting/${roomId}` });
});

module.exports = router;
