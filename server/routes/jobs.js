const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const jobsarr = await db.collection('jobs').find({}).toArray();

  let resarr = [];

  for (let i=0; i<jobsarr.length; i++){
    resarr.push({id: jobsarr[i].ID, title: jobsarr[i].title, company: jobsarr[i].Company, desc: jobsarr[i].description});
  }
  res.status(200).json(resarr);
})

module.exports = router;
