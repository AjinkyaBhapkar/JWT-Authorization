const router = require('express').Router();
let UserName = require('../models/username.model');
const jwt = require('jsonwebtoken')
const { hash, compare } = require('bcryptjs');
const jwtDecode = require('jwt-decode')
require('dotenv').config();

router.route('/').get((req, res) => {
    UserName.find()
        .then(username => res.json(username))
        .catch(err => res.status(400).json('Error' + err));

});



router.route('/deleteall').post((req, res) => {
    UserName.deleteMany({})
        .then(username => { res.json(username) })
        .catch(err => res.status(400).json('Error: ' + err));
});

const generateToken = async (user, res) => {
    let accessToken = await jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET_KEY)
    user = {
        ...user._doc,
        AT: accessToken
    }


    res.status(200).json(user)
}

router.route('/login').post((req, res) => {
    UserName.findOne({ username: req.body.username })
        .then(async user => {
            // res.json(user.username+user.password)
            const valid = await compare(req.body.password, user.password)
            valid ? generateToken(user, res) : res.status(401).json("invalid login or password")

        })
        .catch(() => res.status(400).json('Invalid USer '))
})

router.route('/update/:id').post((req, res) => {
    jwt.verify(req.headers.authorization, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json("Token is not valid!");
        }
        // res.status(200).json(user.user._id)
        if (user.user._id == req.params.id) {
            UserName.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        username: req.body.username,
                    }
                }
            )
                .then(() => {
                    UserName.find({ _id: req.params.id })
                        .then(user => { res.status(200).json( user) })
                })
                .catch((err) => res.status(400).json('Error' + err));
            // res.status(200).json('Authorized')
        } else {
            res.status(403).json("Not authorized!")
        }
        // let uid= jwtDecode(user.AT).user._id

    })
});

router.route('/add').post(async (req, res) => {
    const username = req.body.username;

    const phash = await hash(req.body.username, 12);

    const newUserName = new UserName({
        username,
        "password": phash

    })

    newUserName.save()
        .then(() => res.json('UserName added!'))
        .catch(err => res.status(400).json('Error:' + err))


});

module.exports = router;