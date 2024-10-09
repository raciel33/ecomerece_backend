var express = require('express');
var carritoController = require('../controllers/carritoController');
const { validarJWT } = require('../middlewares/validar-jwt');

var api = express.Router();

api.post('/agregar_carrito_cliente', validarJWT, carritoController.agregar_carrito_cliente);
//
api.get('/get_carrito_cliente/:id', validarJWT, carritoController.get_carrito_cliente);
//
api.delete('/delete_carrito_cliente/:id', validarJWT, carritoController.delete_carrito_cliente);

module.exports = api;