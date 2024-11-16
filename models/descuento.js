'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const DescuentoSchema = Schema({

    titulo: {
        type: String,
        required: true
    },
    banner: {
        type: String,
        required: true
    },
    descuento: {
        type: Number,
        required: true
    },
    fecha_inicio: {
        type: String,
        required: true
    },
    fecha_fin: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }

}, { collection: 'Descuento' }); //aqui podemos definir el nombre de la colection


DescuentoSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('descuento', DescuentoSchema);