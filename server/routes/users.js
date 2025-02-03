const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { searchedText } = req.body;
    const users = db.collection('users');
    try {
      const matchedUsers = await users.find({
        username: { 
          $regex: new RegExp(searchedText, 'i') 
        }
      })
      .project({ username: 1, _id: 0 })
      .limit(10)
      .toArray();
  
      res.json(matchedUsers);
    } catch (error) {
      console.error('Error during user search:', error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  module.exports = router;