const ControllerUser={}
const bcrypt = require('bcryptjs');
const User=require('../models/User')

ControllerUser.obtener = (req,res) =>{

    if (req.params.id)
    {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.params.id});
            } else {
                // También podemos devolver así la información:
                res.status(200).json({ status: "ok", data: user });
            }
        })
    } else {
        // Ayuda: https://mongoosejs.com/docs/api/model.html
        User.find({}, function (err, users) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: users });
        })
    }
}

ControllerUser.crear= async (req,res)=>{
    var {correo,pwd,nombre,apellido,telefono} =req.body //atributos

    if (await User.findOne({ email: correo })) {
        throw 'El correo "' + correo + '" esta en uso';
    }

    if (pwd) {
        pwd= bcrypt.hashSync(pwd, 10);
    }

    const registro=new User({
        isWorker:false,
        correo,
        pwd,
        nombre,
        apellido,
        telefono
    })

    await  registro.save()

    res.json({
        mensaje:"Registro guardado"
    })


}


ControllerUser.actualizar=(req,res)=>{

    User.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err) {
        if (err)
        {
            //res.send(err);
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.params.id});
        }
        else
        {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Usuario actualizado" });
        }
    });
}

ControllerUser.eliminar=(req,res)=>{
    User.findByIdAndRemove(req.params.id, function(err, data) {
        if (err || !data) {
            //res.send(err);
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.params.id});
        }
        else
        {
            res.status(200).json({ status: "ok", data: "Se ha eliminado correctamente el usuario con id: "+req.params.id});

        }
    });
}

module.exports=ControllerUser
