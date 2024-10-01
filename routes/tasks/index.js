const express = require('express');
const router = express.Router();
const handler = require('./handler');

router.post('/add', handler.add);
router.post('/modify', handler.modify);

router.get('/get-all', handler.getAll)

module.exports = router;