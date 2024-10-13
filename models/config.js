'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const ConfigSchema = Schema({

    categorias: [{
        type: Object,
        required: true
    }],
    titulo: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    serie: {
        type: String,
        required: true
    },
    correlativo: {
        type: String,
        required: true
    }

}, { collection: 'config' }); //aqui podemos definir el nombre de la colection


ConfigSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('config', ConfigSchema);