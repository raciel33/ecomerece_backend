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
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }

}, { collection: 'Cliente' }); //aqui podemos definir el nombre de la colection


ClienteSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('cliente', ClienteSchema);