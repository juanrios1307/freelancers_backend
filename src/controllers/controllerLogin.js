const ControllerLogin={}

const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User=require('../models/User');
const CookieParser =require("cookie-parser")

ControllerLogin.authenticate= async (req,res)=> {
    const {correo, pwd} =req.body

    const user = await User.findOne({correo});
    if (user && bcrypt.compareSync(pwd, user.pwd)) {
        const token = jwt.sign({sub: user.id}, config.secret, {expiresIn: '7d'});

        res.cookie('token', token, {httpOnly: true,});

        res.json({
            data:token ,
            mensaje:"Sesion Iniciada"
        });
    }
}

module.exports=ControllerLogin