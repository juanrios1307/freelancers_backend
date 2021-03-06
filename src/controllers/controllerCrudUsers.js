const ControllerUser={}
const bcrypt = require('bcryptjs');
const User=require('../models/User')

ControllerUser.obtener = (req,res) =>{

  const user =req.decoded.sub
    User.findById(user, function (err, user) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: user });
        }
    })
}

ControllerUser.crear= async (req,res)=>{
    var {nombre,correo,pwd,telefono,ciudad} =req.body //atributos

    if (await User.findOne({ correo: correo })) {
        res.json({
            mensaje:"El correo"+correo+" esta en uso"
        })
    }

    if (pwd) {
        pwd= bcrypt.hashSync(pwd, 10);
    }

    const registro=new User({
        isWorker:false,
        correo,
        pwd,
        nombre,
        telefono,
        ciudad,
        Save:[],
        Workers:[],
        Anunces:[],
        Chats:[],
        Membresias:[],
        WorkersBuscados:[]
    })

    await  registro.save()

    res.json({
        mensaje:"Usuario guardado, puede iniciar sesión"
    })


}


ControllerUser.actualizar=(req,res)=>{

    const user=req.decoded.sub

    User.findByIdAndUpdate(user, { $set: req.body }, function (err) {
        if (err) {
            //res.send(err);
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Datos actualizados" });
        }
    });
}

ControllerUser.eliminar=(req,res)=>{

    const user=req.decoded.sub

    User.findByIdAndRemove(user, function(err, data) {
        if (err || !data) {
            //res.send(err);
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            res.status(200).json({ status: "ok", data: "Se ha eliminado correctamente el usuario con id: "+user});

        }
    });
}

module.exports=ControllerUser
