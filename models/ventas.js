'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const VentaSchema = Schema({

    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente', //hace referencia a esta collection
        required: true
    },
    n_venta: {
        type: String,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    envio_titulo: {
        type: String,
        required: true
    },
    envio_precio: {
        type: Number,
        required: true
    },
    transaccion: {
        type: String,
        required: true
    },
    cupon: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: true
    },
    direccion: {
        type: Schema.ObjectId,
        ref: 'direccion', //hace referencia a esta collection
        required: true
    },
    nota: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }

}, { collection: 'Venta' }); //aqui podemos definir el nombre de la colection


VentaSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('venta', VentaSchema);