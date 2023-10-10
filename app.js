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


dbConnection();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }))


//estableciendo rutas
app.use('/api', cliente_route);
app.use('/api', admin_route);



app.listen(process.env.PORT, () => {
    console.log('seridor corriendo en el puerto ' + process.env.PORT)
})


module.exports = app