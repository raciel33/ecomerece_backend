const bcrypt = require('bcryptjs')


//importamos el modelo
const Admin = require('../models/admin');

const { generarJWT } = require('../helpers/jwt');



const registroAdmin = async(req, resp = response) => {

    const { email, password } = req.body; //la respuesta que viene del body


    try {

        const existeEmail = await Admin.findOne({ email }); //busca solo este campo
        const admin = new Admin(req.body); //instancia de cliente del modelo

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
        admin.password = bcrypt.hashSync(password, salt);


        await admin.save(); //guarda en la BD


        //generamos un token
        const token = await generarJWT(admin.id);


        resp.json({
            ok: true,
            admin,
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

const login_admin = async(req, res = response) => {

    const { email, password } = req.body //extraemos el email y password

    try {
        //verificar email
        const adminBD = await Admin.findOne({ email }); //captamos el email

        //si no existe el email
        if (!adminBD) {
            return res.status(404).json({
                ok: false,
                msg: 'email no es valido'
            })
        }

        //verificar contraseña
        /*bcrypt.compareSync: compara la contraseña que escribimos con la que esta en la base de datos
        (devuelve true si coincide)
        */
        const validPassword = bcrypt.compareSync(password, adminBD.password);
        //
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'password no es valido'
            })
        }

        //Generar un tokens
        //generarJWT: viene de /heplpers/jw.js
        const token = await generarJWT(adminBD.id);

        //Si todo va bien devuelve :
        res.json({
            ok: true,
            token,
            adminBD

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
}


const renewToken = async(req, res = response) => {

    const uid = req.uid;

    //Generar un tokens
    //generarJWT: viene de /heplpers/jw.js
    const token = await generarJWT(uid);

    //Obtener el usuario por UID
    const adminDB = await Admin.findById(uid);

    //Si todo va bien
    res.json({
        ok: true,
        adminDB,
        token,

    })
}
module.exports = {
    registroAdmin,
    login_admin,
    renewToken
}