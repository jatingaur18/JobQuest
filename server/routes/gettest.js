const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/:id', async (req, res) => {
  const id = req.params.id
  console.log(id);
  
  try {
    const jobsarr = await db.collection('jobs').findOne({ _id: new ObjectId(id) });
    
    if (!jobsarr) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // console.log(jobsarr);
    res.status(200).json(jobsarr.test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
