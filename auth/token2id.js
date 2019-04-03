var config = require('../config/secret');
var jwt = require('jsonwebtoken');

module.exports = function(token){
    jwt.verify(token,config.secret,(err,decoded) =>{ 
        if(err)
            console.log(err);
        console.log("Token = " + token + "\nID = "+ decoded.id);
        return decoded.id;
        
    })
}
