const { generarJWT } = require('../helpers/jwt');
const { response } = require('express');


const Cupon = require('../models/cupon');
const Admin = require('../models/admin');




const registro_cupon_admin = async(req, resp = response) => {

    const id = req.uid;
    const admin = await Admin.findById(id);


    if (admin) {
        if (admin.rol === 'admin') {

            const data = req.body; //recibo la data

            const reg = await Cupon.create(data);
            resp.status(200).send({ data: reg })


        } else {
            resp.status(500).send({ message: 'No access' })
        }
    } else {
        resp.status(500).send({ message: 'No access' })
    }


};


const listarCupones = async(req, res = response) => {
    const id = req.uid;
    const admin = await Admin.findById(id);

    if (admin) {
        if (admin.rol === 'admin') {
            // let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];
            let data = [];

            /**si no hay filtrado devuelve todos los productos */
            if (filtro == null || filtro == 'null') {
                let reg = await Cupon.find();
                res.status(200).send({ data: reg })

            } else {
                //buscamos el Cupon por su codigo
                let reg = await Cupon.find({ codigo: new RegExp(filtro, 'i') });
                res.status(200).send({ data: reg })

            }


        } else {
            res.status(500).send({ message: 'No access' })
        }

    }
}

const update_cupon_admin = async(req, resp = response) => {

    const id = req.params['id'];

    const data = req.body;

    try {

        const cupon = await Cupon.findById(id);

        if (!cupon) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe cupon con ese id'
            });
        }

        const cuponActualizado = await Cupon.findByIdAndUpdate({ _id: id }, {
            codigo: data.codigo,
            tipo: data.tipo,
            valor: data.valor,
            limite: data.limite,

        });

        resp.status(200).send({ data: cuponActualizado });




    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ',
            error
        })
    }

}

const get_cupon_id = async(req, resp = response) => {

    const id = req.params['id'];
    const idAdmin = req.uid;


    const admin = await Admin.findById(idAdmin);

    if (admin) {
        if (admin.rol === 'admin') {
            try {
                const reg = await Cupon.findById(id);
                resp.status(200).send({ data: reg });

            } catch (error) {
                resp.status(200).send({ data: undefined });

            }
        } else {
            console.log('No eres administrador');
        }

    }


}

const borrarCupon = async(req, res = response) => {

    //captamos el parametro
    const uid = req.params['id'];
    console.log(uid);


    try {
        const cupon = await Cupon.findById(uid);

        //si el usuario no existe
        if (!cupon || cupon == undefined) {
            return res.status(404).json({
                ok: false,
                msg: 'El cupon no existe'
            })
        } else {

            const eliminandoCupon = await Cupon.findByIdAndDelete(uid);

            return res.status(200).json({
                ok: true,
                msg: "eliminando: " + uid
            })
        }
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado '
        })
    }

}
module.exports = {
    registro_cupon_admin,
    listarCupones,
    update_cupon_admin,
    get_cupon_id,
    borrarCupon
}