const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/JWTauth');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SECRET_KEY = process.env.SECRET_KEY || "1x0000000000000000000000000000000AA";

router.post('/', async (req, res) => {
  if (!db) {
    return res.status(500).json({ message: "Database not connected" });
  }

  const userdata = req.body;
  const { cf_turnstile_response: captchaResponse } = req.body;
  if (!captchaResponse) {
    return res.status(400).json({ message: "CAPTCHA token is missing" });
  }
  const users = db.collection('users');
  try {
    const captchaVerificationUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

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
    if (foundUser) {
      if (foundUser.password === userdata.password) {
        const token = jwt.sign(
          { email: foundUser.email, id: foundUser.username },
          JWT_SECRET, 
          { expiresIn: '1h' }
        );

        res.status(200).json({user : foundUser, token: token});
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
