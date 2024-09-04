const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const jobID = req.params.id.slice(1);
  console.log(jobID);
  const jobsarr = await db.collection('jobs').find({}).toArray();
  foundjob = jobsarr.find(x => x.ID === 'googlebackend');
  if(foundjob){
    const dataToSend = (foundjob.participants).sort((a,b) => b.score - a.score)
    console.log(dataToSend);
    res.status(200).json(dataToSend);
  }else{
    res.status(404).send("job not found");
  }
})

module.exports = router;
