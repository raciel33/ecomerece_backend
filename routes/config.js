var express = require('express');
var cofigController = require('../controllers/configController');
const { validarJWT } = require('../middlewares/validar-jwt');
var api = express.Router();


var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/configuraciones' });

api.put('/actualiza_config_admin/:id', [validarJWT, path], cofigController.actualiza_config_admin);
api.get('/obtener_config_admin', validarJWT, cofigController.obtener_config_admin);
api.get('/getLogo/:img?', cofigController.getLogo);
api.get('/obtener_config_public', cofigController.obtener_config_public);




module.exports = api;