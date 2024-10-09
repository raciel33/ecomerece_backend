var Carrito = require('../models/carrito');


const agregar_carrito_cliente = async(req, resp = response) => {

    if (req.uid) {
        let data = req.body;

        let carrito_cliente = await Carrito.find({
            cliente: data.cliente,
            producto: data.producto
        });


        //si no esta el producto en el carrito se puede agregar
        if (carrito_cliente.length == 0) {

            let reg = await Carrito.create(data);
            resp.status(200).send({ data: reg });
        }
        //si ya existe el producto en el carritp
        else if (carrito_cliente.length >= 1) {
            resp.status(200).send({ data: undefined });

        }


    } else {
        resp.status(500).send({ message: 'No access' });

    }

}
const get_carrito_cliente = async(req, resp = response) => {

    if (req.uid) {

        let id = req.params['id'];

        //buscamos el carrito del cliente y con el populate accedemos al producto
        let carrito_cliente = await Carrito.find({ cliente: id }).populate('producto');

        resp.status(200).send({ data: carrito_cliente });


    } else {
        resp.status(500).send({ message: 'No access' });

    }

}
const delete_carrito_cliente = async(req, resp = response) => {

    if (req.uid) {

        let id = req.params['id'];

        let reg = await Carrito.findByIdAndRemove({ _id: id });

        resp.status(200).send({ data: reg });


    } else {
        resp.status(500).send({ message: 'No access' });

    }

}
module.exports = {
    agregar_carrito_cliente,
    get_carrito_cliente,
    delete_carrito_cliente
}