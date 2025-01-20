const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/JWTauth');

router.post('/',authenticateToken, async (req, res) => {
  const userdata = req.body;
  const users = db.collection('users');
  const userarr = await users.find({}).toArray();
  
  const foundUser = userarr.find(x => x.email === userdata.email);
  if(foundUser){
    res.status(409).json({message: "Email already exists"})
  }else{
    users.insertOne(userdata);
    res.status(200).json("signup successful");
  }
})

module.exports = router;
