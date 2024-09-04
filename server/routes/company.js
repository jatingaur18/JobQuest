const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  let companyName = req.params.cname.slice(1);
  console.log(companyName);
  const jobs = db.collection('jobs');
  const jobsarr = await jobs.find({Company: companyName}).toArray();

  res.status(200).json(jobsarr);
})

module.exports = router;
