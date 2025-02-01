const express = require('express');
const router = express.Router();

router.get('/:cname', async (req, res) => {
  try {
    let companyName = req.params.cname.slice(1);
    console.log(companyName);
    const jobs = db.collection('jobs');
    const jobsarr = await jobs.find({ Company: companyName }).toArray();

    res.status(200).json(jobsarr);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
