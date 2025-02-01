const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/:id', async (req, res) => {
  const jobID = req.params.id.slice(1);
  console.log("jobid ", jobID);

  try {
    const foundjob = await db.collection('jobs').findOne({ _id: new ObjectId(jobID) });
    console.log(foundjob);

    if (foundjob) {
      const dataToSend = foundjob.participants.sort((a, b) => b.score - a.score);
      console.log(dataToSend);
      res.status(200).json(dataToSend);
    } else {
      res.status(404).send("Job not found");
    }
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
