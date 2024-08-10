var express = require('express');
var productoController = require('../controllers/productoController');
const { validarJWT } = require('../middlewares/validar-jwt');

var api = express.Router();

var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/productos' })

api.post('/registro_producto_admin', [validarJWT, path], productoController.registro_producto_admin)

api.get('/panel/listar_productos', validarJWT, productoController.listarProductos)

api.get('/filtrar_productos/:filtro?', validarJWT, productoController.listar_productos_filtro_admin);

api.get('/obtener_portada/:img?', productoController.getPortada);

api.get('/get_producto_id/:id', validarJWT, productoController.get_producto_id);

api.put('/update_producto_admin/:id', [validarJWT, path], productoController.update_producto_admin);

api.delete('/deleteProducto/:id', validarJWT, productoController.borrarProducto);





module.exports = api;