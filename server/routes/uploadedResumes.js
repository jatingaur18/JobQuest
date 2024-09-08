const express = require('express')
const router = express.Router()

router.get('/:email', async (req, res) => {
    const resume = await db.collection('resume').find({}).toArray();
    let email = req.params.email.slice(1);
    let resarr = [];

    for (let i=0; i<resume.length; i++){
        if(resume[i].email===email){
            resarr.push({filename:resume[i].filename ,id:resume[i]._id});
        }
    }
    console.log(email)
    console.log(resarr)
  res.status(200).json(resarr);
})

module.exports = router;