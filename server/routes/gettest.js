const express = require('express')
const router = express.Router()

router.post('/:id', async (req, res) => {
  const id = req.params.id.slice(1);
  const questarr = await db.collection('jobs').findOne({ID: "rusted"});
    console.log(questarr);
  res.status(200).json(questarr.test);
})

module.exports = router;
