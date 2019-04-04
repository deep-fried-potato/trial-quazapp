var express = require('express');


var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/secret');

module.exports = function(models){
    let router = express.Router();
    


    router.post('/register', (req,res) => {
        var hashedPassword = bcrypt.hashSync(req.body.password,8);
        models.User.create({
            username : req.body.username,
            name : req.body.name,
            email : req.body.email,
            age: req.body.age,
            isTeacher: req.body.isTeacher,
            password : hashedPassword
        }).then((user)=>{
            
            
            
            //create a token 
            console.log(user);
            var token = jwt.sign({ id : user.userid },config.secret,{
                expiresIn:86400 //expired in 24 hours
            });

            res.status(200).send({ auth: true, token: token });
        }).catch((err)=>{
            console.log(err);
            return res.status(500).send("There was a problem registering the user");
        });
    });
    
    router.get('/me', (req,res) => {
    
        var token = req.get('x-access-token');
        if(!token) 
            return res.status(401).send({auth:false,message:'No token provided'});
    
        jwt.verify(token,config.secret,(err,decoded) =>{ 
            if(err)
                return res.status(500).send({auth:false,message:'Failed to authenticate token'});
            
            res.status(200).send(decoded);
        })
        
    })

    return router
}


