const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/JWTauth');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/', async (req, res) => {
  const userdata = req.body;
  const users = db.collection('users');

  try {
    // Check if the user already exists based on email
    const userarr = await users.find({}).toArray();
    const foundUser = userarr.find(x => (x.email === userdata.email || x.username === userdata.username ));

    if (foundUser) {
      if(foundUser.username === userdata.username){
        return res.status(409).json({ message: "Username already exists" });
      }
      return res.status(409).json({ message: "Email already exists" });
    } else {
      // Insert new user into the collection
      const token = jwt.sign(
                  { email: userdata.email, id: userdata.username },
                  JWT_SECRET, 
                  { expiresIn: '24h' }
                );
      await users.insertOne(userdata);
      res.status(200).json({mess :"Signup successful", token: token});
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
