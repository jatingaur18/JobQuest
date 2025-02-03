const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/JWTauth');

router.post('/', authenticateToken, async (req, res) => {
  const userdata = req.body.user;
  const data = req.body.data;

  const authuser = req.user;
  if (userdata.email !== authuser.email || userdata.username !== authuser.id) {
    return res.status(505).json({ message: 'token failure' });
  }
  const users = db.collection('users');

  try {
    const userarr = await users.find({}).toArray();
    const foundUser = userarr.find(x => x.email === userdata.email);

    if (foundUser) {
      const updateResult = await users.updateOne(
        { email: userdata.email },
        { $set: { profile_section: data } }
      );
      
      res.status(200).json({ message: 'Profile section updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during profile section update:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
