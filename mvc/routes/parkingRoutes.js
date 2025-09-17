const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

router.get('/', parkingController.exibirDashboard);
router.post('/registrar-entrada', parkingController.registrarEntradaVeiculo); // Rota renomeada
router.post('/registrar-saida/:placa', parkingController.registrarSaidaVeiculo);
router.post('/registrar-retorno/:placa', parkingController.registrarRetornoVeiculo); // Nova rota para "Retornou"
router.post('/toggle-block/:placa', parkingController.alternarBloqueioVeiculo);

module.exports = router;