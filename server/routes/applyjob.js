const express = require('express')
const router = express.Router()
const {executePython} = require('../utils');

router.post('/', async (req, res) => {

  const jobs = db.collection('jobs');
  const resume = await db.collection('resume').findOne({email: req.body.email});
  const user = await db.collection('users').findOne({email: req.body.email});
  if(!resume){
    return res.status(404).send("resume not found");
  }

  try{
    const score = await executePython('filter.py', "resume.pdf", "jobdesc.pdf");
  }catch(e){
    console.log("Error occured at executePython", e);
    return res.status(500).send("Internel Server Error");
  }

  console.log(score);

  const pushData = {
    email: user.email,
    name: user.username,
    score: score,
    link: "link"
  }

  jobs.updateOne(
    {ID: req.body.job.id},
    {$push: {participants: pushData}}
  );
  res.status(200).send("done");
})

module.exports = router;
