var express = require('express');
var ventaController = require('../controllers/ventaController');
const { validarJWT } = require('../middlewares/validar-jwt');

var api = express.Router();

var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/productos' })


api.post('/registro_compra_cliente', validarJWT, ventaController.registro_compra_cliente);
api.get('/envio_correo_compra_cliente/:id', validarJWT, ventaController.envio_correo_compra_cliente);


module.exports = api;