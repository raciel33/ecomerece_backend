'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const Detail_VentaSchema = Schema({

    producto: {
        type: Schema.ObjectId,
        ref: 'producto', //hace referencia a esta collection
        required: true
    },
    venta: {
        type: Schema.ObjectId,
        ref: 'venta', //hace referencia a esta collection
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },

    variedad: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente', //hace referencia a esta collection
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }

}, { collection: 'Detail_venta' }); //aqui podemos definir el nombre de la colection


Detail_VentaSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('detail_venta', Detail_VentaSchema);