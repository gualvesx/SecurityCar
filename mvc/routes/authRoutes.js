const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.exibirPaginaLogin);
router.post('/login', authController.efetuarLogin);
router.get('/logout', authController.efetuarLogout);

module.exports = router;