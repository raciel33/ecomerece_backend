const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {
        const payload = {
                uid,
            }
            /*
        const payload = {
            sub: user._id,
            nombres: user.nombres,
            apellidos: user.apellidos,
            email: user.email,
            role: user.rol,
            iat: moment().unix(),
            exp: moment().add(7, 'days').unix()

        };
*/
            //token que se va a firmar: payload
            //Aqui esta la palabra secreta definida para firmar los token: process.env.JWT_SECRET

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('no se pudo generar JWT')
            } else {
                resolve(token);
            }
        });

    })


}


module.exports = {
    generarJWT,
}