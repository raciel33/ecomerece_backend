const bcrypt = require('bcryptjs')


//importamos el modelo
const Cliente = require('../models/cliente');

const { generarJWT } = require('../helpers/jwt');


const registroCliente = async(req, resp = response) => {

    const { email, password } = req.body; //la respuesta que viene del body


    try {

        const existeEmail = await Cliente.findOne({ email }); //busca solo este campo
        const cliente = new Cliente(req.body); //instancia de cliente del modelo

        //validacion para que el email sea unico
        if (existeEmail) {
            //respuesta a dar si existe el email
            return resp.status(400).json({
                ok: false,
                msg: "El correo ya existe"

            })
        }


        //Encriptado de contraseña
        const salt = bcrypt.genSaltSync();
        cliente.password = bcrypt.hashSync(password, salt);


        await cliente.save(); //guarda en la BD


        //generamos un token
        const token = await generarJWT(cliente.id);


        resp.json({
            ok: true,
            cliente,
            token
        });




    } catch (error) {
        console.log(error);

        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        })

    }



};


const login_cliente = async(req, res = response) => {

    const { email, password } = req.body //extraemos el email y password

    try {
        //verificar email
        const clienteBD = await Cliente.findOne({ email }); //captamos el email

        //si no existe el email
        if (!clienteBD) {
            return res.status(404).json({
                ok: false,
                msg: 'email no es valido'
            })
        }

        //verificar contraseña
        /*bcrypt.compareSync: compara la contraseña que escribimos con la que esta en la base de datos
        (devuelve true si coincide)
        */
        const validPassword = bcrypt.compareSync(password, clienteBD.password);
        //
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'password no es valido'
            })
        }

        //Generar un tokens
        //generarJWT: viene de /heplpers/jw.js
        const token = await generarJWT(clienteBD.id);

        //Si todo va bien devuelve :
        res.json({
            ok: true,
            token,

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
}

module.exports = {
    registroCliente,
    login_cliente
}