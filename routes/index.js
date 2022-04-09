var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Model
const UserModel = require('../models/User')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register',(req,res,next)=>{
  //const newUser = new UserModel({username:req.body.username,password:req.body.password});
  const {username,password} = req.body;

  bcrypt.hash(password, 10).then(function(hash) {
    const newUser = new UserModel({username,password:hash});
    newUser.save()
            .then((data)=>{res.json(data)})
            .catch((err)=>{res.json(err)})
});
  
})

router.post('/authenticate',(req,res)=>{
  const {username , password} = req.body;
  UserModel.findOne({username})
              .then((resultUser)=>{
                  if(!resultUser) {res.end("The user was not found.")}
                  else{
                    bcrypt.compare(password,resultUser.password)
                            .then((resultCompare)=>{
                              if (!resultCompare) {
                                res.end("Authentication failed, wrong password...");
                              } else {
                                const payload={username};
                                //JWT
                                const token=jwt.sign(payload,req.app.get("api_secret_key"),{expiresIn:6000/*60sec=1hour*/ });
                                res.json({status:true,token})
                              }
                            })
                  }
                  //res.json(resultUser)
              })
              .catch((err)=>{res.json(err)})
})

module.exports = router;
