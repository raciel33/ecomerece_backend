var express = require('express');
var paymentsControllers = require('../controllers/payments');
const { validarJWT } = require('../middlewares/validar-jwt');

var api = express.Router();

var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/productos' })


//Genarar nueva orden!
api.post('/realizar_pago_tarjeta', [validarJWT, path], paymentsControllers.realizar_pago_tarjeta);



module.exports = api;