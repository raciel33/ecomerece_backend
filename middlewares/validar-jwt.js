const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');


const validarJWT = (req, res, next) => {

    //leer el token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay token'
        })
    }

    try {

        //captamos el id correspondiente a este token
        //process.env.JWT_SECRET: hace referencia donde tengo la palabra secreta para firmar token (./env)
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
        next();


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'token incorrecto'
        })
    }


}



const validarADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid;

    try {

        const adminDB = await Admin.findById(uid); //Buscamos el usuario por id
        console.log(adminDB.rol);
        //si no existe
        if (!adminDB) {
            res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            });
        }
        //si el role no es 'ADMIN_ROLE'
        if (adminDB.rol != 'admin') {
            res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        });

    }

}



module.exports = {
    validarJWT,
    validarADMIN_ROLE,
}