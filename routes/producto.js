var express = require('express');
var productoController = require('../controllers/productoController');
const { validarJWT } = require('../middlewares/validar-jwt');

var api = express.Router();

var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/productos' }); //especifica donde se guardan las imagenes

//PRODUCTOS
api.post('/registro_producto_admin', [validarJWT, path], productoController.registro_producto_admin)

api.get('/panel/listar_productos', validarJWT, productoController.listarProductos)

api.get('/filtrar_productos/:filtro?', validarJWT, productoController.listar_productos_filtro_admin);

api.get('/obtener_portada/:img?', productoController.getPortada);

api.get('/get_producto_id/:id', validarJWT, productoController.get_producto_id);

api.put('/update_producto_admin/:id', [validarJWT, path], productoController.update_producto_admin);

api.delete('/deleteProducto/:id', validarJWT, productoController.borrarProducto);

api.put('/update_producto_variedades/:id', validarJWT, productoController.update_producto_variedades);

api.put('/agregar_img_galeria_admin/:id', [validarJWT, path], productoController.agregar_img_galeria_admin);
//    
api.put('/eliminar_img_galeria_admin/:id', validarJWT, productoController.eliminar_img_galeria_admin);

//Publico

api.get('/listar_productos_publico/:filtro?', productoController.listar_productos_publico);
api.get('/detalle_producto_publico/:slug?', productoController.detalle_producto_publico);
api.get('/listar_productos_recomendados_publico/:categoria?', productoController.listar_productos_recomendados_publico);


//INVENTARIO

api.get('/listar_inventario_producto_admin/:id', validarJWT, productoController.listar_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id', validarJWT, productoController.eliminar_inventario_producto_admin);
api.post('/registro_inventario', [validarJWT, path], productoController.registro_inventario)
    //

module.exports = api;