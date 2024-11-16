/**
 * sectret_key: sk_test_51QC60CKzje4IjR2rrrwAejgDJQaD3jg8xT35fDyH6iXAfUZmNa1AWi2M81VCClklcPw8fJWg0Spa3GRtnGDPUCKw00z4Rg5T60
 
   public_key: pk_test_51QC60CKzje4IjR2rrNmHOmapYwSRSzgT5q8qGZF7wQQS7RrxQsNV88beMhuEwanShqRI0GPKBvdazqNUQemy1zyI00MHLttpDL
*/
const stripe = require('stripe')('sk_test_51QC60CKzje4IjR2rrrwAejgDJQaD3jg8xT35fDyH6iXAfUZmNa1AWi2M81VCClklcPw8fJWg0Spa3GRtnGDPUCKw00z4Rg5T60')


const realizar_pago_tarjeta = async(req, res = response, next) => {

    //console.log(req.body);

    stripe.charges.create({

        amount: req.body.amount * 100,
        currency: 'EUR',
        description: 'One-time setup fee',
        source: req.body.token.id
    }, (err, charge) => {
        if (err) {
            next(err)
        }

        res.json({ success: true, status: 'Payaments Successfull' })
    })

}



const pago_exitoso = async(req, resp = response) => {

    console.log('ok');
}
const cancelar_pago = async(req, resp = response) => {


}

module.exports = {
    realizar_pago_tarjeta,
    pago_exitoso
}