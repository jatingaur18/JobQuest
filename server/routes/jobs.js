const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobsarr = await db.collection('jobs').find({}).toArray();
    
    let resarr = [];
    
    for (let i = 0; i < jobsarr.length; i++) {
      resarr.push({
        id: jobsarr[i]._id, 
        title: jobsarr[i].title, 
        company: jobsarr[i].Company, 
        desc: jobsarr[i].description
      });
    }

    res.status(200).json(resarr);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
