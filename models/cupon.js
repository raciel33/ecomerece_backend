'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const CuponSchema = Schema({

    codigo: {
        type: String,
        required: true
    },
    tipo: { //porcentaje o precio fijo
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    limite: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }

}, { collection: 'cupon' }); //aqui podemos definir el nombre de la colection


CuponSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('cupon', CuponSchema);