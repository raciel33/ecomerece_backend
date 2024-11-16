var Venta = require('../models/ventas');
var Detail_venta = require('../models/detail_venta');
var Producto = require('../models/productos');
var Carrito = require('../models/carrito');

const { response } = require('express');


//envio de correo de confirmacion de compra
var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');




const registro_compra_cliente = async(req, resp = response) => {

    if (req.uid) {

        let data = req.body;
        let details = data.details;


        //ultima venta
        var venta_last = await Venta.find().sort({ createdAt: -1 });

        var serie;
        var correlativo;
        var n_venta

        //primera venta
        if (venta_last.length == 0) {
            serie = '001';

            correlativo = '000001';

            n_venta = serie + '-' + correlativo;


        } else {
            //>=1 regitro de venta


            var last_n_venta = venta_last[0].n_venta;

            //se divide serie y correlativo  " 001-000001"
            var arr_last_n_venta = last_n_venta.split('-');

            //validamos que el correlativo no haya alcanzado esta cifra
            if (arr_last_n_venta[1] != '999999') {

                //se la pasa a la funcion el correlativo "000001" y la posicion que se va a sumar
                var new_correlativo = zfill(parseInt(arr_last_n_venta[1]) + 1, 6);

                //concatenacion del numero de serie con el nuevo correlativo sumado
                n_venta = arr_last_n_venta[0] + '-' + new_correlativo;
            }

            //si el correlativo ya a alcanzado esta cifra
            else if (arr_last_n_venta[1] == '999999') {

                //se la pasa a la funcion la serie "001" y la posicion que se va a sumar
                var new_serie = zfill(parseInt(arr_last_n_venta[1]) + 1, 3);

                //concatenacion del numero de serie sumado con el correlativo reseteado
                n_venta = new_serie + '-' + '000001';
            }


        }

        data.n_venta = n_venta;
        data.estado = 'Procesando';


        //se guarda la venta 
        let venta = await Venta.create(data);

        //para guardar los detalles de la venta se itera la data recibida y se guarda en d_detalles

        details.forEach(async element => {

            element.venta = venta._id;

            await Detail_venta.create(element);

            //al hacer la venta se actualiza el stock del producto
            let element_producto = await Producto.findById({ _id: element.producto });
            let new_stock = element_producto.stock - element.cantidad;

            await Producto.findByIdAndUpdate({ _id: element.producto }, {
                stock: new_stock
            });


            //Al hacer la venta se limpia el carrito
            await Carrito.deleteMany({ cliente: data.cliente });



        });

        resp.status(200).send({
            venta: venta,
        });



    } else {
        resp.status(500).send({ message: 'No access' });

    }

    //esta funcion se utiliza para  suma el correlativo  para numerar las ventas
    //omite los ceros del correlativo 

    function zfill(number, width) {
        var numberOutput = Math.abs(number);
        var length = number.toString().length;
        var zero = "0";

        if (width <= length) {
            if (number < 0) {
                return ("-" + numberOutput.toString());
            } else {
                return numberOutput.toString();
            }
        } else {
            if (number < 0) {
                return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
            } else {
                return ((zero.repeat(width - length)) + numberOutput.toString());
            }

        }
    }

}

const envio_correo_compra_cliente = async(req, res = response) => {


    var readHTMLFile = function(path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
            if (err) {
                throw err;
                callback(err);
            } else {
                callback(null, html);
            }
        });
    };
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'reyesblanco1988@gmail.com',
            pass: 'uisidixbjhcnkvtg'
        }
    }));
    try {
        //Preparacion de la data para el envio de confirmacion del email

        const id = req.params['id'];

        let venta = await Venta.findById({ _id: id }).populate('cliente');
        let details = await Detail_venta.find({ venta: id }).populate('producto');

        var cliente = venta.cliente.nombres + ' ' + venta.cliente.apellidos;
        var _id = venta._id;
        var fecha = new Date(venta.createdAt);
        var data = details;
        var subtotal = venta.subtotal;
        var precio_envio = venta.envio_precio

        readHTMLFile(process.cwd() + '/mail.html', (err, html) => {

            let rest_html = ejs.render(html, { data: data, cliente: cliente, _id: _id, fecha: fecha, subtotal: subtotal, precio_envio: precio_envio });

            var template = handlebars.compile(rest_html);
            var htmlToSend = template({ op: true });

            var mailOptions = {
                from: 'reyesblanco1988@gmail.com',
                to: venta.cliente.email,
                subject: 'Gracias por tu compra, Mi Tienda',
                html: htmlToSend
            };


            res.status(200).send({ data: true });
            transporter.sendMail(mailOptions, function(error, info) {
                if (!error) {
                    console.log('Email sent: ' + info.response);
                }
            });

        });

    } catch (error) {
        res.status(200).send({ data: undefined });




    }
}


module.exports = {
    registro_compra_cliente,
    envio_correo_compra_cliente
}