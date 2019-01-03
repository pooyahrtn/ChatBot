const express = require('express');

const router = express.Router();
const chatRouter = require('../components/chat/router');

router.get('/status', (req, res) => res.send('OK'));

router.use(chatRouter);

module.exports = router;
