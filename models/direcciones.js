'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const DireccionesSchema = Schema({

    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente', //hace referencia a esta collection
        require: true
    },
    destinatario: {
        type: String,
        require: true
    },
    dni: {
        type: String,
        require: true
    },
    cp: {
        type: String,
        require: true
    },
    direccion: {
        type: String,
        require: true
    },
    pais: {
        type: String,
        require: true
    },
    region: {
        type: String,
        require: true
    },
    provincia: {
        type: String,
        require: true
    },
    distrito: {
        type: String,
        require: true
    },
    telefono: {
        type: String,
        require: true
    },
    principal: {
        type: Boolean,
        require: true
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