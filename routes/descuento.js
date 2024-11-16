var express = require('express');
var descuentoController = require('../controllers/descuentoController');
const { validarJWT } = require('../middlewares/validar-jwt');

var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/descuentos' }); //especifica donde se guardan las imagenes

var api = express.Router();



api.post('/registro_descuento_admin', [validarJWT, path], descuentoController.registro_descuento_admin)

api.get('/listar_descuentos/:filtro?', validarJWT, descuentoController.listar_descuentos)

api.get('/get_img_banner_descuento/:img?', descuentoController.get_img_banner_descuento);

api.get('/get_descuento_id/:id', validarJWT, descuentoController.get_descuento_id);

api.put('/update_descuento_admin/:id', [validarJWT, path], descuentoController.update_descuento_admin);

api.delete('/delete_descuento/:id', validarJWT, descuentoController.delete_descuento);
//
api.get('/obtener_descuento_activo/', descuentoController.obtener_descuento_activo);

module.exports = api;