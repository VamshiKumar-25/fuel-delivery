const express = require('express');
const router = express.Router();
// Update the import
const { registerUser, loginUser } = require('../controllers/userController.js');

router.post('/', registerUser);
// NEW: Add the login route
router.post('/login', loginUser);

module.exports = router;
