const express = require('express');
const router = express.Router();
const handler = require('./handler');

router.post('/login', handler.login);
router.post('/logout', handler.logout);
router.post('/register', handler.register);

router.get('/create-mock', handler.insertFakeUsers)
router.get('/get-all', handler.getAll)
router.get('/delete-collection', handler.deleteUsersCollection)

module.exports = router;