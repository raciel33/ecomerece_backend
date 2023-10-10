'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const AdminSchema = Schema({

    nombres: {
        type: String,
        require: true
    },
    apellidos: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },

    telefono: {
        type: String,
        require: true
    },
    rol: {
        type: String,
        require: true
    },

    dni: {
        type: String,
        require: true
    }

}, { collection: 'Admin' }); //aqui podemos definir el nombre de la colection





module.exports = model('admin', AdminSchema);