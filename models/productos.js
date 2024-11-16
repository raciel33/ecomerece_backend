'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const ProductoSchema = Schema({

    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },

    galeria: [{
        type: Object,
        required: false
    }],
    portada: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    n_ventas: {
        type: Number,
        default: 0,
        required: true
    },
    n_puntos: {
        type: Number,
        default: 0,
        required: true
    },
    variedades: [{
        type: Object,
        required: false
    }],
    titulo_variedad: {
        type: String,
        required: false
    },
    categoria: {
        type: String,
        required: true
    },

    estado: {
        type: String,
        default: 'Edicion',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }

}, { collection: 'Producto' }, { typeKey: '$type' }); //aqui podemos definir el nombre de la colection


ProductoSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('producto', ProductoSchema);