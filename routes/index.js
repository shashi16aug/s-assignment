const express = require('express');
const router = express.Router();
const suggerboxUser = require('../controller/suggerBoxUsers');
const validator = require('../middleware/apiValidator');
const User = require('../models/suggerboxUsers')


/**
 *  routes for creating user
 */

router.post('/user', suggerboxUser.userCreate);
router.post('/user-login/', suggerboxUser.userLogIn);
router.get('/users/', validator.tokenValidator, suggerboxUser.userList);
router.delete('/user/:id', function(req, res) {
    User.remove({
        _id: req.params.id,

    }, function(err, user) {
        if (err)
            return console.error(err);

        console.log('User successfully removed from polls collection!');
        res.status(200).send();


    });

});

module.exports = router;