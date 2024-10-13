'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const CarritoSchema = Schema({

    producto: {
        type: Schema.ObjectId,
        ref: 'producto', //hace referencia a esta collection
        required: true
    },
    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente', //hace referencia a esta collection
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },


    variedad: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }

}, { collection: 'Carrito' }); //aqui podemos definir el nombre de la colection


CarritoSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('carrito', CarritoSchema);