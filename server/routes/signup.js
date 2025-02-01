const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/JWTauth');

router.post('/', async (req, res) => {
  const userdata = req.body;
  const users = db.collection('users');

  try {
    // Check if the user already exists based on email
    const userarr = await users.find({}).toArray();
    const foundUser = userarr.find(x => x.email === userdata.email);

    if (foundUser) {
      return res.status(409).json({ message: "Email already exists" });
    } else {
      // Insert new user into the collection
      await users.insertOne(userdata);
      res.status(200).json("Signup successful");
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
