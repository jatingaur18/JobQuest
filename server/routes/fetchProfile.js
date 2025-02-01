const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const userdata = req.body;
  const users = db.collection('users');
  console.log(userdata)

  try {
    const userarr = await users.find({}).toArray();
    const foundUser = userarr.find(x => x.username === userdata.username);

    if (foundUser) {   
      delete foundUser.password;
      console.log(foundUser)
      res.status(200).json({ profile: foundUser });
    } else {
      // If user doesn't exist, return an error
      console.log("here")
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during profile section update:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
