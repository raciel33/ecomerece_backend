'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const DireccionesSchema = Schema({

    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente', //hace referencia a esta collection
        required: true
    },
    destinatario: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true
    },
    cp: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    pais: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: false
    },
    provincia: {
        type: String,
        required: false
    },
    poblacion: {
        type: String,
        required: false
    },
    telefono: {
        type: String,
        required: true
    },
    principal: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        require: true
    }

}, { collection: 'Direccion' }); //aqui podemos definir el nombre de la colection


DireccionesSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('direccion', DireccionesSchema);