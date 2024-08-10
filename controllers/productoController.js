const { generarJWT } = require('../helpers/jwt');

//importamos el modelo

const Producto = require('../models/productos');
const Admin = require('../models/admin');
const { response } = require('express');
const fs = require('fs'); //para la imagen de portada de los productos
const path = require('path')


const registro_producto_admin = async(req, resp = response) => {

    const id = req.uid;
    const admin = await Admin.findById(id);


    if (admin) {
        if (admin.rol === 'admin') {

            const data = req.body; //recibo la data

            //-----------PROCESAMIENTO DE LA IMAGEN PORTADA---------------------------
            const img_path = req.files.portada.path //recibo la imagen de portada (ruta donde esta el nombre de la imagen)

            if (img_path == undefined) {
                resp.status(500).json({
                    ok: false,
                    msg: 'Error inesperado portada no válida',
                    error
                })
            } else {

                const path_img_array = img_path.split('\\') //dividimos la ruta en un array para acceder al nombre de img

                const portada_name = path_img_array[2]; //obtenemos el nombre de la portada

                data.portada = portada_name; //le asignamos el nombre a la imagen de portada

                //------------------------ -----FIN -----
                data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/^[\w]+/g, '') //convertimos el titulo en un slug


                const producto = new Producto(data); //instancia de cliente del modelo             


                await producto.save(); //guarda en la BD

                resp.json({
                    ok: true,
                    producto,
                    msg: 'Nuevo producto creado'
                });
            }


        }

    } else {
        console.log('no administrador');
    }

};

//ARREGLAR PAGINATION
const listarProductos = async(req, res = response) => {


    const id = req.uid;
    const admin = await Admin.findById(id);

    if (admin) {
        if (admin.rol === 'admin') {

            const desde = Number(req.query.desde); //pagination

            const [productos, total] = await Promise.all([

                // Usuario.find();: devuelve todos los campos
                //  Usuario.find( {}, 'nombre email'); especificamos los campos que queremos 
                //PAGINACION!!!!!!!
                //skip( desde ) obtiene el resultado a partir de aqui
                //limit( 5 ): definimos el numero de resultados a obtener

                Producto.find().skip(desde).limit(6),
                Producto.count()
            ])


            res.json({
                ok: true,
                productos,
                total
            });
        }



    }
}

const listar_productos_filtro_admin = async(req, res = response) => {

    // let tipo = req.params['tipo'];
    let filtro = req.params['filtro'];
    let data = [];

    /**si no hay filtrado devuelve todos los productos */
    if (filtro == null || filtro == 'null') {
        let reg = await Producto.find();
        res.status(200).send({ data: reg })

    } else {
        //buscamos el producto por su titulo
        let reg = await Producto.find({ titulo: new RegExp(filtro, 'i') });
        res.status(200).send({ data: reg });


    }

}

const getPortada = async(req, res = response) => {

    let img = req.params['img'];

    //para la imagen de la portada
    fs.stat('./uploads/productos/' + img, function(err) {
        if (!err) {

            /**si no hay error en la ruta cogemos el path de la imagen */
            let path_img = './uploads/productos/' + img;
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

const get_producto_id = async(req, resp = response) => {

    const id = req.params['id'];
    const idAdmin = req.uid;

    const reg = await Producto.findById(id);

    const admin = await Admin.findById(idAdmin);

    if (admin) {
        if (admin.rol === 'admin') {
            try {
                resp.status(200).send({ data: reg });

            } catch (error) {
                resp.status(200).send({ data: undefined });

            }
        } else {
            console.log('No eres administrador');
        }

    }


}

const update_producto_admin = async(req, resp = response) => {

    const id = req.params['id'];

    const data = req.body

    try {

        const producto = await Producto.findById(id);

        if (!producto) {
            return resp.status(404).json({
                ok: false,
                msg: 'No exixtse producto con ese id'
            });
        }
        //si hay imagen
        if (req.files) {

            const img_path = req.files.portada.path;
            const path_img_array = img_path.split('\\') //dividimos la ruta en un array para acceder al nombre de img

            const portada_name = path_img_array[2]; //obtenemos el nombre de la portada

            data.portada = portada_name; //le asignamos el nombre a la imagen de portada

            const productoActualizado = await Producto.findByIdAndUpdate({ _id: id }, {
                titulo: data.titulo,
                stock: data.stock,
                precio: data.precio,
                categoria: data.categoria,
                descripcion: data.descripcion,
                portada: data.portada

            });

            /**para que cuando se actualice la imagen de portada de un producto en la BD se elimine la imagen anterior y se reemplace por la nueva
             * (asi no se acumulan imagenenes innecesarias)
             */

            fs.stat('./uploads/productos/' + productoActualizado.portada, function(err) {
                if (!err) {
                    fs.unlink('./uploads/productos/' + productoActualizado.portada, (err) => {
                        if (err) throw err
                    })
                }
            })

            resp.status(200).send({ data: productoActualizado })

        }
        //si no hay imagen
        else {
            const productoActualizado = await Producto.findByIdAndUpdate({ _id: id }, {
                titulo: data.titulo,
                stock: data.stock,
                precio: data.precio,
                categoria: data.categoria,
                descripcion: data.descripcion,

            });

            resp.status(200).send({ data: productoActualizado })
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

const borrarProducto = async(req, res = response) => {

    //captamos el parametro
    const uid = req.params['id'];
    console.log(uid);


    try {
        const producto = await Producto.findById(uid);

        //si el usuario no existe
        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'El producto no existe'
            })
        } else {

            const eliminandoProducto = await Producto.findByIdAndDelete(uid);

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
    registro_producto_admin,
    listarProductos,
    listar_productos_filtro_admin,
    getPortada,
    get_producto_id,
    update_producto_admin,
    borrarProducto
}