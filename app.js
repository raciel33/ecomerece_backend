require('dotenv').config();

const path = require('path'); //predefindo de express

const express = require('express');
const cors = require('cors');

//aqui esta la conexion 
const { dbConnection } = require('./database/config');

//crear el servidor express
const app = express();

//Configurar cors
app.use(cors());

/**app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
}); */

var bodyparser = require('body-parser');
var mongoose = require('mongoose');

//referencias al archivo de rutas
var cliente_route = require('./routes/cliente')
var admin_route = require('./routes/admin')
var producto_route = require('./routes/producto');
var cupon_route = require('./routes/cupon');
var config_route = require('./routes/config')
var carrito_route = require('./routes/carrito')



dbConnection();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }))

//comunicacion con sockets

var server = require('http').createServer(app);

var io = require('socket.io')(server, {
    cors: { origin: '*' }
});

io.on('connection', function(socket) {

    //eliminar un item del carrito
    socket.on('delete-carrito', function(data) {
        io.emit('new-carrito', data);
        console.log(data);
    });

    //añadir producto al carrito
    socket.on('add-carrito', function(data) {
        io.emit('add-new-carrito', data);
        console.log(data);
    });

})


//estableciendo rutas
app.use('/api', cliente_route);
app.use('/api', admin_route);
app.use('/api', producto_route);
app.use('/api', cupon_route);
app.use('/api', config_route);
app.use('/api', carrito_route);






//sockets a la escucha
server.listen(process.env.PORT, () => {
    console.log('seridor corriendo en el puerto ' + process.env.PORT);
})

//SIN SOCKETS
// app.listen(process.env.PORT, () => {
//     console.log('seridor corriendo en el puerto ' + process.env.PORT)
// })


module.exports = app