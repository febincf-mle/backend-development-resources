const express = require('express');
const { registerUser, loginUser, refreshTokenForUser } = require('../controllers/identityController');


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('token/refresh', refreshTokenForUser);


module.exports = router;
