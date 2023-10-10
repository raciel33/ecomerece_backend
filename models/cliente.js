'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const ClienteSchema = Schema({

    nombres: {
        type: String,
        require: true
    },
    apellidos: {
        type: String,
        require: true
    },

    pais: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    perfil: {
        type: String,
        default: 'perfil.png',
        require: false
    },
    telefono: {
        type: String,
        require: false
    },
    genero: {
        type: String,
        require: false
    },
    f_nacimiento: {
        type: String,
        require: false
    },
    dni: {
        type: String,
        require: false
    }

}, { collection: 'Cliente' }); //aqui podemos definir el nombre de la colection





module.exports = model('cliente', ClienteSchema);