const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  if (!db) {
    return res.status(500).json({ message: "Database not connected" });
  }

  const userdata = req.body;
  const users = db.collection('users');
  try {
    const userarr = await users.find({}).toArray();

    const foundUser = userarr.find(x => x.email === userdata.email);
    if (foundUser) {
      if (foundUser.password === userdata.password) {
        res.status(200).json(foundUser);
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (err) {
    console.error('Error finding user', err);
    res.status(500).json({ message: "Internal server error" });
  }
})

module.exports = router;
