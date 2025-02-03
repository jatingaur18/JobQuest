const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobsarr = await db.collection('jobs').find({}).toArray();
    
    for (let i = 0; i < jobsarr.length; i++) {
      delete jobsarr[i].password;
    }

    res.status(200).json(jobsarr);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
