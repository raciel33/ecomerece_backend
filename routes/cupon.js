var express = require('express');
var cuponController = require('../controllers/cuponController');
const { validarJWT } = require('../middlewares/validar-jwt');

var api = express.Router();

var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/productos' })



api.post('/registro_cupon_admin', [validarJWT, path], cuponController.registro_cupon_admin)
api.get('/listar_cupones/:filtro?', validarJWT, cuponController.listarCupones);
api.put('/update_cupon_admin/:id', [validarJWT, path], cuponController.update_cupon_admin)
api.get('/get_cupon_id/:id', validarJWT, cuponController.get_cupon_id);
api.delete('/deleteCupon/:id', validarJWT, cuponController.borrarCupon);




module.exports = api;