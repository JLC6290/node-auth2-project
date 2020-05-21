const express = require('express');
const router = express.Router();
const User = require('../models/user-model');


function restricted(req, res, next){
    if(req.session && req.session.loggedIn){
        next();
    }else{
        res.status(401).json({ message: 'Unauthorized' });
    }
}

router.use(restricted);

router.get('/', (req, res) => {
    User.find()
        .then(list => {
            res.status(200).json(list);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: error.message });
        })
})

module.exports = router;