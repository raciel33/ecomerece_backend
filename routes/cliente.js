var express = require('express');
var clienteController = require('../controllers/clienteControllers');
const { validarJWT } = require('../middlewares/validar-jwt');

var api = express.Router();

api.post('/registroCliente', clienteController.registroCliente);

api.post('/registroCliente_admin', validarJWT, clienteController.registro_cliente_admin);


api.get('/panel/cliente', clienteController.getClientes);

api.get('/listar_clientes_filtro_admin/:tipo/:filtro', validarJWT, clienteController.listar_cliente_filtro_admin);

api.get('/get_cliente_id/:id', validarJWT, clienteController.get_cliente_id);

api.put('/update_cliente_admin/:id', validarJWT, clienteController.update_cliente_admin);

api.delete('/delete/:id', validarJWT, clienteController.borrarCliente);

//NO ADMINISTRADOR
api.post('/login_cliente', clienteController.login_cliente);
api.get('/get_cliente_sesion_id/:id', validarJWT, clienteController.get_cliente_sesion_id);
api.put('/update_cliente_perfil/:id', clienteController.update_cliente_perfil);


module.exports = api;