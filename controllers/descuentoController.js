'use strict'
const Descuento = require('../models/descuento');
const Admin = require('../models/admin');

const { response } = require('express');


const fs = require('fs'); //para la imagen de portada de los productos
const path = require('path')


const registro_descuento_admin = async(req, resp = response) => {

    const id = req.uid;
    const admin = await Admin.findById(id);


    if (admin) {
        if (admin.rol === 'admin') {

            const data = req.body; //recibo la data

            //-----------PROCESAMIENTO DE LA IMAGEN PORTADA---------------------------
            const img_path = req.files.banner.path; //recibo la imagen del banner (ruta donde esta el nombre de la imagen)

            if (img_path == undefined) {
                resp.status(500).json({
                    ok: false,
                    msg: 'Error inesperado portada no válida',
                    error
                })
            } else {

                const path_img_array = img_path.split('\\') //dividimos la ruta en un array para acceder al nombre de img

                const banner_name = path_img_array[2]; //obtenemos el nombre del banner

                data.banner = banner_name; //le asignamos el nombre a la imagen del banner

                //------------------------ -----FIN -----




                const descuento = new Descuento(data); //instancia de cliente del modelo             


                await descuento.save(); //guarda en la BD



                resp.json({
                    ok: true,
                    descuento,
                    msg: 'Nuevo descuento creado'
                });
            }


        }

    } else {
        console.log('no administrador');
    }





};

const listar_descuentos = async(req, res = response) => {


    const id = req.uid;
    const admin = await Admin.findById(id);

    if (admin) {
        if (admin.rol === 'admin') {

            let filtro = req.params['filtro'];

            /**si no hay filtrado devuelve todos los desceuntos */
            if (filtro == null || filtro == 'null') {
                let reg = await Descuento.find();
                res.status(200).send({ data: reg })

            } else {
                //buscamos el Descuento por su titulo y lo ordenamos por la fecha de creacion (primeros los mas recientes)
                let reg = await Descuento.find({ titulo: new RegExp(filtro, 'i') }).sort({ createdAt: -1 });
                res.status(200).send({ data: reg });


            }


        }



    }

}

const get_img_banner_descuento = async(req, res = response) => {

    let img = req.params['img'];

    //para la imagen de la portada
    fs.stat('./uploads/descuentos/' + img, function(err) {
        if (!err) {

            /**si no hay error en la ruta cogemos el path de la imagen */
            let path_img = './uploads/descuentos/' + img;
            //enviamos la imgagen al frontend
            res.status(200).sendFile(path.resolve(path_img))
        } else {

            /**si  hay error en la ruta cogemos el path de la imagen por defecto */
            let path_img = './uploads/default.jpg';
            //enviamos la imgagen al frontend
            res.status(200).sendFile(path.resolve(path_img))
        }
    })

}

const get_descuento_id = async(req, resp = response) => {

    const id = req.params['id'];
    const idAdmin = req.uid;


    const admin = await Admin.findById(idAdmin);

    if (admin) {
        if (admin.rol === 'admin') {
            try {
                const reg = await Descuento.findById(id);
                resp.status(200).send({ data: reg });

            } catch (error) {
                resp.status(200).send({ data: undefined });

            }
        } else {
            console.log('No eres administrador');
        }

    }


}


const update_descuento_admin = async(req, resp = response) => {

        const id = req.params['id'];

        const data = req.body

        try {

            const descuento = await Descuento.findById(id);

            if (!descuento) {
                return resp.status(404).json({
                    ok: false,
                    msg: 'No exixtse descuento con ese id'
                });
            }
            //si hay imagen
            if (req.files) {

                const img_path = req.files.banner.path;
                const path_img_array = img_path.split('\\') //dividimos la ruta en un array para acceder al nombre de img

                const banner_name = path_img_array[2]; //obtenemos el nombre de la banner

                data.banner = banner_name; //le asignamos el nombre a la imagen de banner

                const descuentoActualizado = await Descuento.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    banner: banner_name,
                    descuento: data.descuento,
                    fecha_inicio: data.fecha_inicio,
                    fecha_fin: data.fecha_fin,

                });

                /**para que cuando se actualice la imagen de portada de un producto en la BD se elimine la imagen anterior y se reemplace por la nueva
                 * (asi no se acumulan imagenenes innecesarias)
                 */

                fs.stat('./uploads/descuentos/' + descuentoActualizado.banner, function(err) {
                    if (!err) {
                        fs.unlink('./uploads/descuentos/' + descuentoActualizado.banner, (err) => {
                            if (err) throw err
                        })
                    }
                })

                resp.status(200).send({ data: descuentoActualizado })

            }
            //si no hay imagen
            else {
                const descuentoActualizado = await Descuento.findByIdAndUpdate({ _id: id }, {
                    titulo: data.titulo,
                    descuento: data.descuento,
                    fecha_inicio: data.fecha_inicio,
                    fecha_fin: data.fecha_fin,

                });

                resp.status(200).send({ data: descuentoActualizado });
            }



        } catch (error) {
            console.log(error);
            resp.status(500).json({
                ok: false,
                msg: 'Error inesperado ',
                error
            })
        }

    }
    //
const delete_descuento = async(req, res = response) => {

    //captamos el parametro
    const uid = req.params['id'];


    try {
        const descuento = await Descuento.findById(uid);
        console.log(descuento);


        //si el usuario no existe
        if (!descuento) {
            return res.status(404).json({
                ok: false,
                msg: 'El producto no existe'
            })
        } else {

            const eliminando_Descuento = await Descuento.findByIdAndDelete(uid);

            //para que se elimine tambien de la carpeta uploads
            fs.stat('./uploads/descuentos/' + descuento.banner, function(err) {
                if (!err) {
                    fs.unlink('./uploads/descuentos/' + descuento.banner, (err) => {
                        if (err) throw err

                        return res.status(200).json({
                            ok: true,
                            msg: "eliminando: " + uid
                        })
                    })
                }
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
const obtener_descuento_activo = async(req, res = response) => {

    let arr_descuentos = [];

    try {

        let descuento = await Descuento.find().sort({ createdAt: -1 });

        var today = Date.parse(new Date().toString()) / 1000 //fecha actual en formato timestamp


        /**Para establecer el estado del descuento modificamos las fechas a timestamp
         * para hacer la comparativa con la fecha actual
         */
        descuento.forEach(element => {

            var tt_inicio = Date.parse(element.fecha_inicio + "T00:00:00") / 1000;
            var tt_fin = Date.parse(element.fecha_fin + "T23:59:59") / 1000


            //si esta vigente guardamos los descuentos
            if (today >= tt_inicio && today <= tt_fin) {
                arr_descuentos.push(element);
            }
        });

        //si hay descuentos activos
        if (arr_descuentos.length >= 1) {

            res.status(200).send({ data: arr_descuentos });

            // console.log(arr_descuentos);
        } else {
            res.status(200).send({ data: undefined });

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
    registro_descuento_admin,
    listar_descuentos,
    get_img_banner_descuento,
    get_descuento_id,
    update_descuento_admin,
    delete_descuento,
    obtener_descuento_activo

}