'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const InventarioSchema = Schema({

    producto: {
        type: Schema.ObjectId,
        ref: 'producto', //hace referencia a esta collection
        required: true
    },

    cantidad: {
        type: Number,
        required: true
    },
    admin: {
        type: Schema.ObjectId,
        ref: 'admin', //hace referencia a esta collection
        required: true
    },
    proveedor: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }

}, { collection: 'Inventario' }); //aqui podemos definir el nombre de la colection


InventarioSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('inventario', InventarioSchema);