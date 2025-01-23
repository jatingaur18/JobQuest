const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/JWTauth');

router.post('/',authenticateToken, async (req, res) => {
  const userdata = req.body;
  const { cf_turnstile_response: captchaResponse } = req.body;
  if (!captchaResponse) {
    return res.status(400).json({ message: "CAPTCHA token is missing" });
  }
  const users = db.collection('users');
  const captchaVerificationUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const secretKey = "1x0000000000000000000000000000000AA"; // Replace with your secret key

  const verifyResponse = await fetch(captchaVerificationUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret: secretKey,
      response: captchaResponse,
    }),
  });

  const verificationResult = await verifyResponse.json();

  if (!verificationResult.success) {
    return res.status(400).json({ message: "CAPTCHA verification failed", errors: verificationResult["error-codes"] });
  }
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
