const Config = require('../models/config');
const Admin = require('../models/admin');
var path = require('path')

const fs = require('fs'); //para la imagen de portada de los productos

const obtener_config_admin = async(req, resp = response) => {

    const id = req.uid;
    const admin = await Admin.findById(id);

    if (admin) {
        if (admin.rol === 'admin') {

            const reg = await Config.findById({ _id: "66e0058ee9dd7c253c42248e" });

            resp.status(200).send({ data: reg });


        } else {
            resp.status(500).send({ message: 'No access' });
        }

    } else {
        resp.status(500).send({ message: 'No access' });
    }
};


const actualiza_config_admin = async(req, resp = response) => {
    const id = req.uid;
    const admin = await Admin.findById(id);

    if (admin) {
        if (admin.rol === 'admin') {

            const data = req.body;

            //si hay imagen
            if (req.files) {

                const img_path = req.files.logo.path;
                const path_img_array = img_path.split('\\'); //dividimos la ruta en un array para acceder al nombre de img

                const logo_name = path_img_array[2]; //obtenemos el nombre de la logo

                data.logo = logo_name; //le asignamos el nombre a la imagen de logo

                const reg = await Config.findByIdAndUpdate(

                    { _id: "66e0058ee9dd7c253c42248e" }, {
                        categorias: JSON.parse(data.categorias),
                        titulo: data.titulo,
                        serie: data.serie,
                        logo: logo_name,
                        correlativo: data.correlativo

                    }
                );

                /**para que cuando se actualice la imagen de portada de un producto en la BD se elimine la imagen anterior y se reemplace por la nueva
                 * (asi no se acumulan imagenenes innecesarias)
                 **/

                fs.stat('./uploads/configuraciones/' + reg.logo, function(err) {
                    if (!err) {
                        fs.unlink('./uploads/configuraciones/' + reg.logo, (err) => {
                            if (err) throw err;
                        });
                    }
                });

                resp.status(200).send({ data: reg });

            }
            //si no hay imagen
            else {
                console.log('NO HAY IMAGEN');
                const reg = await Config.findByIdAndUpdate(

                    { _id: "66e0058ee9dd7c253c42248e" }, {
                        titulo: data.titulo,
                        serie: data.serie,
                        correlativo: data.correlativo,
                        categorias: data.categorias,

                    }
                )
                resp.status(200).send({ data: reg });



                await Config.create({
                    categorias: [],
                    titulo: 'createX',
                    logo: 'logo.png',
                    serie: '01',
                    correlativo: '00001'
                });


            }
        } else {
            resp.status(500).send({ message: 'No access' });
        }

    } else {
        resp.status(500).send({ message: 'No access' });
    }
}



const getLogo = async(req, res = response) => {

    let img = req.params['img'];

    //para la imagen de la portada
    fs.stat('./uploads/configuraciones/' + img, function(err) {
        if (!err) {

            /**si no hay error en la ruta cogemos el path de la imagen */
            let path_img = './uploads/configuraciones/' + img;
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
const obtener_config_public = async(req, res = response) => {

    const reg = await Config.findById({ _id: "66e0058ee9dd7c253c42248e" });
    res.status(200).send({ data: reg });



};

module.exports = {
    actualiza_config_admin,
    obtener_config_admin,
    getLogo,
    obtener_config_public


}