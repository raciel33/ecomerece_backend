const bcrypt = require('bcryptjs')


//importamos el modelo
const Cliente = require('../models/cliente');
const Admin = require('../models/admin');
const Direccion = require('../models/direcciones')

const { generarJWT } = require('../helpers/jwt');
const { response } = require('express');



//---------------NO ADMINISTRADOR------------------------
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
//Obtener cliente que está en la sesion NO ADMINISTRADOR
const get_cliente_sesion_id = async(req, resp = response) => {

    const id = req.params['id'];

    try {
        const reg = await Cliente.findById(id);
        resp.status(200).send({ data: reg });

    } catch (error) {
        resp.status(200).send({ data: undefined });

    }





}

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
            clienteBD

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });

    }
}

const update_cliente_perfil = async(req, resp = response) => {

    const id = req.params['id'];


    try {

        const data = req.body
        const cliente = await Cliente.findById(id);


        //si el usuario no existe
        if (!cliente) {
            return resp.status(404).json({
                ok: false,
                msg: 'No exixtse cliente con ese id'
            });
        }

        //si se va actualizar el password
        const { password } = req.body; // extraemos el email

        if (password) {
            //Encriptado de contraseña 
            const salt = bcrypt.genSaltSync();
            cliente.password = bcrypt.hashSync(password, salt);

            //findByIdAndUpdate ( uid, campos) (el primer parametro 'uid' indicamos que usuario queremos actualizar y el segundo 'campos' los campos a a actualizar)
            const clienteActualizado = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                pais: data.pais,
                genero: data.genero,
                password: cliente.password
            });

            resp.status(200).send({ data: clienteActualizado });

        }
        //Si NO SE ACTUALIZA PASSWORD
        else {

            //findByIdAndUpdate ( uid, campos) (el primer parametro 'uid' indicamos que usuario queremos actualizar y el segundo 'campos' los campos a a actualizar)
            const clienteActualizado = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                pais: data.pais,
                genero: data.genero,

            });


            resp.status(200).send({ data: clienteActualizado });

        }
        /*   resp.json({
                ok: true,
                data,
                cliente: clienteActualizado
            })

*/


    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ',
            error
        })
    }





}


//--------------DIRECCIONES----------------------------

const registro_direccion_cliente = async(req, resp = response) => {

    const id = req.uid;
    console.log(req.body);

    try {
        //comprobamos que sea un cliente
        if (id) {

            var data = req.body;

            //Si esta es la direccion principal (si el check de cuenta principal es true)
            if (data.principal) {

                //todas las direcciones del cliente
                const direcciones = await Direccion.find({ cliente: data.cliente });

                //recorremos todas las direcciones del cliente y ponemos el campo principal en false
                direcciones.forEach(async element => {

                    await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false });
                });

            }


            //se guarda la direccion
            const reg = await Direccion.create(data);

            resp.status(200).send({ data: reg });


        } else {
            console.log('no cliente');
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'No tienes los permisos para registrar nuevas direcciones'
        })
    }


}

const listar_direccion_cliente = async(req, resp = response) => {

    const id = req.params['id'];

    try {
        //comprobamos que sea un cliente
        if (id) {

            //todas las direcciones del cliente
            const direcciones = await Direccion.find({ cliente: id }).populate('cliente').sort({ createdAt: -1 });

            resp.status(200).send({ data: direcciones });


        } else {
            console.log('no cliente');
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'No tienes los permisos para registrar nuevas direcciones'
        })
    }


}

const cambiar_direccion_principal = async(req, resp = response) => {

    const cliente_id = req.uid;
    console.log(req.body);

    try {
        //comprobamos que sea un cliente
        if (cliente_id) {

            var id = req.params['id'];

            //todas las direcciones del cliente
            const direcciones = await Direccion.find({ cliente: cliente_id });

            //recorremos todas las direcciones del cliente y ponemos el campo principal en false
            direcciones.forEach(async element => {

                await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false });
            });

            //ponemos la direccion seleccionada en true
            await Direccion.findByIdAndUpdate({ _id: id }, { principal: true });


            resp.status(200).send({ data: true });


        } else {
            console.log('no cliente');
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'No tienes los permisos para registrar nuevas direcciones'
        })
    }


}


const borrar_direccion = async(req, res = response) => {

    //captamos el parametro
    const uid = req.params['id'];
    console.log(uid);


    try {
        const direccion = await Direccion.findById(uid);

        //si el usuario no existe
        if (!direccion) {
            return res.status(404).json({
                ok: false,
                msg: 'La direccion no existe'
            })
        } else {

            const eliminando_direccion = await Direccion.findByIdAndDelete(uid);

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

const get_direccion_principal = async(req, resp = response) => {

    const id = req.uid;
    //  console.log(req.body);

    try {
        //comprobamos que sea un cliente
        if (id) {

            var direccion = undefined; //si no tiene direccion principal

            //buscamos la direccion que tenga como campo principal: true
            direccion = await Direccion.findOne({ cliente: id, principal: true });

            //si no tiene direccion principal
            if (direccion == undefined) {
                resp.status(200).send({ data: undefined });

            } else {

                resp.status(200).send({ data: direccion });
            }



        } else {
            console.log('no cliente');
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'No tienes los permisos para registrar nuevas direcciones'
        })
    }


}

//---------------ADMINISTRADOR-----------------------------
const listar_cliente_filtro_admin = async(req, res = response) => {

    let tipo = req.params['tipo'];
    let filtro = req.params['filtro'];
    let data = [];

    /**si no hay filtrado devuelve todos los clientes */
    if (tipo == null || tipo == 'null') {


        let reg = await Cliente.find();
        res.status(200).send({ data: reg })

    } else {

        //si el tipo de busqueda es por apellidos 
        if (tipo == 'apellidos') {
            let reg = await Cliente.find({ apellidos: new RegExp(filtro, 'i') });
            res.status(200).send({ data: reg });

            //si el tipo de busqueda es por email 

        } else if (tipo == 'email') {
            let reg = await Cliente.find({ email: new RegExp(filtro, 'i') })
            res.status(200).send({ data: reg });
        }
    }

}

/*Esta funcion la tengo que arreglar */
const registro_cliente_admin = async(req, resp = response) => {

    const id = req.uid;
    const { password, email } = req.body; //la respuesta que viene del body

    try {
        //comprobamos que sea un administrador

        const admin = await Admin.findById(id);

        const existeEmail = await Cliente.findOne({ email }); //busca solo este campo


        //validacion para que el email sea unico
        if (existeEmail) {
            //respuesta a dar si existe el email
            return resp.status(400).json({
                ok: false,
                msg: "El correo ya existe"

            })
        }

        if (admin) {
            if (admin.rol === 'admin') {
                var data = req.body;
                //Encriptado de contraseña
                const salt = bcrypt.genSaltSync();
                data.password = bcrypt.hashSync(password, salt);

                const cliente = new Cliente(data); //instancia de cliente del modelo             
                console.log(cliente);

                await cliente.save(); //guarda en la BD

                resp.json({
                    ok: true,
                    cliente,
                    msg: 'Nuevo cliente creado'
                });


            }

        } else {
            console.log('no administrador');
        }
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            ok: false,
            msg: 'No tienes los permisos para registrar nuevos clientes'
        })
    }


}


//listar todos los clientes
const getClientes = async(req, resp) => {

    const desde = Number(req.query.desde); //pagination

    const [clientes, total] = await Promise.all([

        // Usuario.find();: devuelve todos los campos
        //  Usuario.find( {}, 'nombre email'); especificamos los campos que queremos 
        //PAGINACION!!!!!!!
        //skip( desde ) obtiene el resultado a partir de aqui
        //limit( 5 ): definimos el numero de resultados a obtener

        Cliente.find().skip(desde).limit(6),
        Cliente.count()
    ])


    resp.json({
        ok: true,
        clientes,
        total
    });
};

const get_cliente_id = async(req, resp = response) => {

    const id = req.params['id'];
    const idAdmin = req.uid;

    const reg = await Cliente.findById(id);

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

const update_cliente_admin = async(req, resp = response) => {

    const id = req.params['id'];

    const data = req.body

    try {

        const cliente = await Cliente.findById(id);

        //si el usuario no existe
        if (!cliente) {
            return resp.status(404).json({
                ok: false,
                msg: 'No exixtse cliente con ese id'
            });
        }
        const { email } = req.body; // extraemos el email

        if (cliente.email !== req.body.email) {

            const existeEmail = await Cliente.findOne({ email });

            if (existeEmail) {
                return resp.status(404).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        //findByIdAndUpdate ( uid, campos) (el primer parametro 'uid' indicamos que usuario queremos actualizar y el segundo 'campos' los campos a a actualizar)
        const clienteActualizado = await Cliente.findByIdAndUpdate({ _id: id }, {
            nombres: data.nombres,
            apellidos: data.apellidos,
            email: data.email,
            telefono: data.telefono,
            f_nacimiento: data.f_nacimiento,
            dni: data.dni,
            genero: data.genero
        });

        resp.status(200).send({ data: clienteActualizado })
            /*   resp.json({
                ok: true,
                data,
                cliente: clienteActualizado
            })
*/



    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ',
            error
        })
    }





}

const borrarCliente = async(req, res = response) => {

    //captamos el parametro
    const uid = req.params['id'];
    console.log(uid);


    try {
        const cliente = await Cliente.findById(uid);

        //si el usuario no existe
        if (!cliente) {
            return res.status(404).json({
                ok: false,
                msg: 'El cliente no existe'
            })
        } else {

            const eliminandoCliente = await Cliente.findByIdAndDelete(uid);

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
    registroCliente,
    login_cliente,
    getClientes,
    listar_cliente_filtro_admin,
    registro_cliente_admin,
    get_cliente_id,
    update_cliente_admin,
    borrarCliente,
    get_cliente_sesion_id,
    update_cliente_perfil,
    registro_direccion_cliente,
    listar_direccion_cliente,
    cambiar_direccion_principal,
    borrar_direccion,
    get_direccion_principal



}