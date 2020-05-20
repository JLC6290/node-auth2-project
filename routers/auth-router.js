const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

const {isValid} = require('../models/user-services');

router.post('/register', (req, res) => {
    const credentials = req.body;

    if(isValid(credentials)){
        const ROUNDS = process.env.BCRYPT_ROUNDS || 8;
        const hash = bcrypt.hashSync(credentials.password, ROUNDS);

        credentials.password = hash

        User.add(credentials)
            .then(user => {
                res.status(201).json({ data: user });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ message: error.message });
            })
    }else{
        res.status(400).json({ message: 'Invalid username and/or password.'})
    }
})

router.post('/login', (req, res) => {
    const {username, password} = req.body;

    if(isValid(req.body)){
        User.findBy({username: username})
            .then(([user]) => {
                if(user && bcrypt.compareSync(password, user.password)){
                    const token = generateToken(user);

                    // req.session.loggedIn = true;
                    // req.session.user = user;
                    res.status(200).json({ message: `${user.username} is logged in`, token});
                }else{
                    res.status(401).json({ message: 'invalid username and/or password.'});
                }
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ message: error.message });
            })
    }else{
        res.status(400).json({ message: 'Invalid username and/or password.'})
    }
})

// generateToken

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,

    }
    const options = {
        expiresIn: '1h'
    }
    return jwt.sign(payload, secrets.jwtSecret, options)
}

router.get('/users', (req, res) => {
    if(req.session && req.session.loggedIn){
        User.find()
            .then(users => {
                res.status(200).json(users);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ message: 'internal server error' });
            })
    }else{
        res.status(401).json({ message: 'Unauthorized' });
    }
})

router.get('/logout', (req, res) => {
    if(req.session){
        res.session.destroy(error => {
            if(error){
                res.status(500).json({ message: 'error logging out user, please contact server admin' });
            }else{
                res.status(204).end();
            }
        })
    }else{
        res.status(204).end();
    }
})

module.exports = router;