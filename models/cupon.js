'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const CuponSchema = Schema({

    codigo: {
        type: String,
        require: true
    },
    tipo: { //porcentaje o precio fijo
        type: String,
        require: true
    },
    valor: {
        type: Number,
        require: true
    },
    limite: {
        type: Number,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }

}, { collection: 'cupon' }); //aqui podemos definir el nombre de la colection


CuponSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('cupon', CuponSchema);