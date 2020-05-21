const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

function verifyUser(req, res, next) {
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, secrets.jwtSecret, (error, decodedToken) => {
            if(error){
                res.status(401).json({ message: 'invalid token' });
            }else{
                req.username = decodedToken.username;
                req.subject = decodedToken.subject;
                next();
            }
        })
    }else{
        res.status(401).json({ message: 'You, shall, not, PASS!! '});
    }    
}
module.exports = verifyUser;