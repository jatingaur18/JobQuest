const express = require('express');
const router = express.Router();

router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email.slice(1);  // Removing leading slash (if present)
    const resume = await db.collection('resume').find({}).toArray();

    let resarr = [];

    // Filter the resumes matching the provided email
    for (let i = 0; i < resume.length; i++) {
      if (resume[i].email === email) {
        resarr.push({
          filename: resume[i].filename,
          path: resume[i].path,
          pdf: resume[i].pdf
        });
      }
    }

    console.log(email);
    console.log(resarr);

    res.status(200).json(resarr);  // Send the filtered result to the client
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
