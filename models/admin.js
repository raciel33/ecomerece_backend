'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const AdminSchema = Schema({

    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    telefono: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },

    dni: {
        type: String,
        required: true
    }

}, { collection: 'Admin' }); //aqui podemos definir el nombre de la colection





module.exports = model('admin', AdminSchema);