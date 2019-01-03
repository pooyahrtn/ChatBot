const express = require('express');
const validate = require('express-validation');


const { Question, Converstation } = require('./model');

const router = express.Router();

router.post('/start', async (_req, res) => {
    const converstation = await Converstation.create({});
    
    res.send(converstation._id);
});

module.exports = router;
