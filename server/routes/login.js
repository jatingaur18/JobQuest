const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/JWTauth');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
        try {
          const token = jwt.sign(
            { email: foundUser.email, id: foundUser.username },
            JWT_SECRET, 
            { expiresIn: '24h' }
          );

          res.status(200).json({ user: foundUser, token: token });
        } catch (jwtError) {
          console.error('Error signing JWT:', jwtError);
          res.status(500).json({ message: 'Error signing token' });
        }
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
});

module.exports = router;
