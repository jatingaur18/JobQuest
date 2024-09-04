const express = require('express')
const multer = require('multer');
const os = require('os');
const router = express.Router()

const upload = multer({ dest: os.tmpdir() });

router.post('/', upload.single('resume'), async (req, res) => {
  const fs = require('fs');
  const resume = await db.collection('resume');

  resume.insertOne({
    email: req.headers.email,
    filename: req.file.originalname,
  });

  fs.writeFileSync('./myFile', req.file.toString());

  try{
    await fs.createReadStream('./myFile').
      pipe(bucket.openUploadStream(`${req.headers.email}_${req.file.originalname}`));
    console.log("Resume uploaded successfully");
  }catch(e){
    console.log("Error occured while uploading resume", e);
    return res.status(500).send("Internal Server Error");
  }

  res.status(200).send("done");
})

module.exports = router;
