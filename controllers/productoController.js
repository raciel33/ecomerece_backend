const { generarJWT } = require('../helpers/jwt');

//importamos el modelo

const Producto = require('../models/productos');
const Inventario = require('../models/inventario');
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
            const img_path = req.files.portada.path; //recibo la imagen de portada (ruta donde esta el nombre de la imagen)

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

                //data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/^[\w]+/g, '') //convertimos el titulo en un slug
                data.slug = data.titulo.toLowerCase().replace(/\W|^/g, '_') //convertimos el titulo en un slug


                const producto = new Producto(data); //instancia de cliente del modelo             


                await producto.save(); //guarda en la BD

                //Se registra también el producto en inventario
                let inventario = await Inventario.create({
                    admin: req.uid, //ver que usuario creó este producto
                    apellidos: req.apellidos,
                    cantidad: data.stock,
                    proveedor: 'Primer registro',
                    producto: producto._id

                })

                resp.json({
                    ok: true,
                    producto,
                    inventario,
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


    const admin = await Admin.findById(idAdmin);

    if (admin) {
        if (admin.rol === 'admin') {
            try {
                const reg = await Producto.findById(id);
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


    try {
        const producto = await Producto.findById(uid);
        console.log(producto);


        //si el usuario no existe
        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'El producto no existe'
            })
        } else {

            const eliminandoProducto = await Producto.findByIdAndDelete(uid);

            //para que se elimine tambien de la carpeta uploads
            fs.stat('./uploads/productos/' + producto.portada, function(err) {
                if (!err) {
                    fs.unlink('./uploads/productos/' + producto.portada, (err) => {
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
const listar_inventario_producto_admin = async(req, res = response) => {

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

            //captamos el producto que este en el inventario con ese id y el user que lo creó y lo ordenamos por fecha

            var reg = await Inventario.find({ producto: uid }).populate('admin').sort({ createdAt: -1 });

            res.status(200).send({ data: reg }); //enviamos inventario del producto captado
        }
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado '
        })
    }

}
const eliminar_inventario_producto_admin = async(req, res = response) => {

    //captamos el parametro
    const id = req.params['id'];

    try {

        //localizamos el inventario donde esta el producto
        const inventario = await Inventario.find({ producto: id })

        //localizamos el id del inventario
        const inventarioId = await Inventario.findById(inventario)

        //eliminamos el inventario del producto
        const reg = await Inventario.findByIdAndDelete(inventarioId._id);

        //localizamos el producto
        let producto = await Producto.findById({ _id: id });

        //restamos el stock
        const nuevo_stock = parseInt(producto.stock - inventarioId.cantidad);

        let productoStockActualizado = await Producto.findByIdAndUpdate({ _id: id }, {

            stock: nuevo_stock //actualizamos el stock
        });


        res.status(200).send({ data: productoStockActualizado });


        /*
            let producto = await Producto.findById({ _id: id }); //localizamos el producto
        
            var inventario = await Inventario.find({ producto: id })
        
            var nuevo_stock = 0;
        
            //nuevo_stock = parseInt(producto.stock - inventario.cantidad); //restamos el stock
        
            let productoStockActualizado = await Producto.findByIdAndUpdate({ _id: id }, {
                
                stock: nuevo_stock //actualizamos el stock
            });

            let reg = await Inventario.findByIdAndDelete({ _id: id }); //eliminamos el producto del inventario
        
            res.status(200).send({ data: productoStockActualizado });*/
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado '
        })
    }

}

const registro_inventario = async(req, resp = response) => {

    const id = req.uid;
    const admin = await Admin.findById(id);

    if (admin) {
        if (admin.rol === 'admin') {

            const data = req.body; //recibo la data


            //Se registra también el producto en inventario
            let inventarioRegistro = await Inventario.create(data);

            //localizamos el producto
            let producto = await Producto.findById({ _id: inventarioRegistro.producto });

            //sumamos el stock actual con el stock a aumentar
            const nuevo_stock = parseInt(producto.stock + inventarioRegistro.cantidad);

            let productoStockActualizado = await Producto.findByIdAndUpdate({ _id: inventarioRegistro.producto }, {

                stock: nuevo_stock //actualizamos el stock
            });

            resp.json({
                ok: true,
                inventarioRegistro,
                msg: 'Nuevo producto creado'
            });
        }




    } else {
        console.log('no administrador');


    }
}

const update_producto_variedades = async(req, resp = response) => {

    const id = req.params['id'];

    const data = req.body;
    console.log(data);

    try {

        const producto = await Producto.findById(id);

        if (!producto) {
            return resp.status(404).json({
                ok: false,
                msg: 'No exixtse producto con ese id'
            });
        }

        //se actualiza los campoos de las variedades
        const productoActualizado = await Producto.findByIdAndUpdate({ _id: id }, {
            titulo_variedad: data.titulo_variedad,
            variedades: data.variedades,

        });

        resp.status(200).send({ data: productoActualizado });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ',
            error
        })
    }

}
const agregar_img_galeria_admin = async(req, resp = response) => {

    const id = req.params['id'];

    const data = req.body;
    console.log(data);

    try {
        //-----------PROCESAMIENTO DE LA IMAGEN ---------------------------
        const img_path = req.files.imagen.path; //recibo la imagen  (ruta donde esta el nombre de la imagen)

        if (img_path == undefined) {
            resp.status(500).json({
                ok: false,
                msg: 'Error inesperado portada no válida',
                error
            })
        } else {

            //dividimos la ruta en un array para acceder al nombre de img
            const path_img_array = img_path.split('\\');

            //obtenemos el nombre de la imagen
            const imagen_name = path_img_array[2];

            //AÑADIMOS LA IMAGEN AL ARRAY DE LA GALERIA DEL PRODUCTO y le damos un id
            let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                $push: {
                    galeria: {
                        imagen: imagen_name,
                        _id: data._id
                    }
                }
            });




            resp.status(200).send({ data: reg });


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
const eliminar_img_galeria_admin = async(req, resp = response) => {

    const id = req.params['id'];

    const data = req.body;
    console.log(data);

    try {
        //-----------PROCESAMIENTO DE LA IMAGEN ---------------------------



        //AÑADIMOS LA IMAGEN AL ARRAY DE LA GALERIA DEL PRODUCTO y le damos un id
        let reg = await Producto.findByIdAndUpdate({ _id: id }, {
            $pull: {
                galeria: {
                    _id: data._id
                }
            }
        });

        //para que se elimine tambien de la carpeta uploads
        fs.stat('./uploads/productos/' + data.imagen, function(err) {
            if (!err) {
                fs.unlink('./uploads/productos/' + data.imagen, (err) => {
                    if (err) throw err
                    resp.status(200).send({ data: reg });
                })
            }
        })







    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ',
            error
        })
    }

}

///-------PUBLICO---------------------
const listar_productos_publico = async(req, res = response) => {

    // let tipo = req.params['tipo'];
    let filtro = req.params['filtro'];
    let data = [];

    /**si no hay filtrado devuelve todos los productos */
    if (filtro == null || filtro == 'null') {
        let reg = await Producto.find();
        res.status(200).send({ data: reg })

    } else {
        //buscamos el producto por su titulo y lo ordenamos por la fecha de creacion (primeros los mas recientes)
        let reg = await Producto.find({ titulo: new RegExp(filtro, 'i') }).sort({ createdAt: -1 });
        res.status(200).send({ data: reg });


    }

};
const detalle_producto_publico = async(req, res = response) => {

    // let tipo = req.params['tipo'];
    let slug = req.params['slug'];

    //buscamos el producto por su slug
    let reg = await Producto.findOne({ slug: slug });
    res.status(200).send({ data: reg });

};
const listar_productos_recomendados_publico = async(req, res = response) => {

    let categoria = req.params['categoria'];
    //buscamos el producto por su categoria y lo ordenamos por la fecha de creacion (primeros los mas recientes)-limitamos a 8 productos
    let reg = await Producto.find({ categoria: categoria }).sort({ createdAt: -1 }).limit(8);
    res.status(200).send({ data: reg });




};
const listar_productos_nuevos_publico = async(req, res = response) => {


    let reg = await Producto.find().sort({ createdAt: -1 }).limit(8);
    res.status(200).send({ data: reg })



};

const listar_mas_vendidos_publico = async(req, res = response) => {


    let reg = await Producto.find().sort({ n_ventas: -1 }).limit(8);
    res.status(200).send({ data: reg })



};
module.exports = {
    registro_producto_admin,
    listarProductos,
    listar_productos_filtro_admin,
    getPortada,
    get_producto_id,
    update_producto_admin,
    borrarProducto,
    listar_inventario_producto_admin,
    eliminar_inventario_producto_admin,
    registro_inventario,
    update_producto_variedades,
    agregar_img_galeria_admin,
    eliminar_img_galeria_admin,
    listar_productos_publico,
    detalle_producto_publico,
    listar_productos_recomendados_publico,
    listar_productos_nuevos_publico,
    listar_mas_vendidos_publico
}