var express = require('express');
const { Router } = require('express');

var adminController = require('../controllers/adminController');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { renewToken } = require('../controllers/adminController');



var api = express.Router();

api.post('/registroAdmin', adminController.registroAdmin);


api.post('/login_admin', [
    check('email', 'el correo es obligatorio').isEmail(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    validarCampos
], adminController.login_admin);


//saca al usuario cuando expire el token
api.get('/renew',
    validarJWT,
    renewToken
);


module.exports = api;