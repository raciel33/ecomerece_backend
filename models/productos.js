'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const ProductoSchema = Schema({

    titulo: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },

    galeria: [{
        type: Object,
        require: false
    }],
    portada: {
        type: String,
        require: true
    },
    precio: {
        type: Number,
        require: true
    },
    descripcion: {
        type: String,
        require: true
    },
    contenido: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    n_ventas: {
        type: Number,
        default: 0,
        require: true
    },
    n_puntos: {
        type: Number,
        default: 0,
        require: true
    },
    variedades: [{
        type: Object,
        require: false
    }],
    titulo_variedad: {
        type: String,
        require: false
    },
    categoria: {
        type: String,
        require: true
    },

    estado: {
        type: String,
        default: 'Edicion',
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }

}, { collection: 'Producto' }, { typeKey: '$type' }); //aqui podemos definir el nombre de la colection


ProductoSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('producto', ProductoSchema);