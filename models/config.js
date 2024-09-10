'use strict'

const { Schema, model, SchemaType } = require('mongoose');


const ConfigSchema = Schema({

    categorias: [{
        type: Object,
        require: true
    }],
    titulo: {
        type: String,
        require: true
    },
    logo: {
        type: String,
        require: true
    },
    serie: {
        type: String,
        require: true
    },
    correlativo: {
        type: String,
        require: true
    }

}, { collection: 'config' }); //aqui podemos definir el nombre de la colection


ConfigSchema.method('toJSON', function() {

    //extraemos __v,_id de todos los campos de mi objeto
    const { __v, ...object } = this.toObject();


    return object;
})




module.exports = model('config', ConfigSchema);