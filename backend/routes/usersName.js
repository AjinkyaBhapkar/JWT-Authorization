const router = require('express').Router();
let UserName = require('../models/username.model');
const jwt = require('jsonwebtoken')
const { hash, compare } = require('bcryptjs');
const jwtDecode = require('jwt-decode')
require('dotenv').config();

let refToken=[]

router.route('').get((req, res) => {
    UserName.find()
        .then(username => res.json(username))
        .catch(err => res.status(400).json('Error' + err));

});



router.route('/deleteall').post((req, res) => {
    UserName.deleteMany({})
        .then(username => { res.json(username) })
        .catch(err => res.status(400).json('Error: ' + err));
});

const generateAccessToken = (user) => {
    return jwt.sign({_id:user._id} , process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '1m'})}
    
const generateRefreshToken =  (user) => {
   return jwt.sign( {_id:user._id} , process.env.REFRESH_TOKEN_SECRET_KEY)

}
const valid =(user,res,prevRT)=>{
    let AT=generateAccessToken(user);
    let RT=generateRefreshToken(user);
    let userd={
        ...user,
        AT,
        RT
    }
    refToken=refToken.filter(token=> token !==prevRT)
    refToken.push(RT)
    res.status(200).json(userd)

}

router.route('/login').post((req, res) => {
    UserName.findOne({ username: req.body.username })
        .then(async user => {
            
            const isValid = await compare(req.body.password, user.password)
           
            isValid ? valid(user,res) : res.status(401).json("invalid login or password")

        })
        .catch(() => res.status(400).json('Invalid USer '))
})
router.route('/user/:id').get((req, res) => {
    UserName.find( {_id: req.params.id} )
        .then( user => {res.status(200).json(user)})
        .catch(err=>res.status(400).json(err))})

router.route('/refresh').post((req, res) => {
    if(req.body.RT==undefined ){res.status(400).json('Not authorized')}
    (refToken.includes(req.body.RT))? '':  res.status(401).json('invalid authorization')

    jwt.verify(req.body.RT,process.env.REFRESH_TOKEN_SECRET_KEY,(err,user)=>{
        if (err){
            res.status(403).json('Authorization failed')

        }

        valid(user,res,req.body.RT)
    })
})




router.route('/update/:id').post((req, res) => {
    jwt.verify(req.headers.authorization, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json("No match");
        }
        // res.status(200).json(user.user._id)

        if (user._id == req.params.id) {
            // res.status(200).json('entered block')
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
                        .then(user =>  res.status(200).json(user) )
                })
                .catch((err) => res.status(400).json('Error' + err));
            
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