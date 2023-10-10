var express = require('express');
var clienteController = require('../controllers/clienteControllers');

var api = express.Router();

api.post('/registroCliente', clienteController.registroCliente);
api.post('/login_cliente', clienteController.login_cliente);


module.exports = api;