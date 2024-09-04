const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const createjob = req.body;

  const jobs = db.collection('jobs');
  
  createjob['participants'] = [null];
  console.log(createjob.description);

  try {
    const testText = await executePythonone('test_generator/test_generator.py', createjob.description);
    createjob['test'] = await gettest(testText);
    console.log(createjob);
    await jobs.insertOne(createjob);
    res.status(200).send("done");
  } catch (error) {
    console.error('Error generating test:', error);
    res.status(500).json({ message: "Internal server error while generating test" });
  }
})

module.exports = router;
