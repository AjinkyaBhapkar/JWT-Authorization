const router = require('express').Router();
let UserName = require('../models/username.model');

const { hash, compare } = require('bcryptjs');


router.route('/').get((req, res) => {
    UserName.find()
        .then(username => res.json(username))
        .catch(err => res.status(400).json('Error' + err));

});

router.route('/update/:id').post((req, res) => {
    UserName.updateOne(
        { _id: req.params.id },
        {
            $set: {
                username: req.body.username,
            }
        }
    )
        .then(() => { res.json('UserName updated successfully!') })
        .catch((err) => res.status(400).json('Error' + err));
});

router.route('/deleteall').post((req, res) => {
    UserName.deleteMany({})
        .then(username => { res.json(username) })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req,res)=>{
    UserName.findOne({username:req.body.username})
    .then( async user=>{
        // res.json(user.username+user.password)
        const valid = await compare(req.body.password,user.password) 
       valid? res.status(200).json('Login Successful'):res.status(401).json("invalid login or password")
    })
    .catch(err=>res.status(400).json('Invalid user ' + err))
})

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