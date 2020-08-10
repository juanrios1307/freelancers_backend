const ControllerUser={}
const User=require('../models/User')

ControllerUser.obtenerAll=async(req,res)=>{

    const result = await User.find({}).exec()
    res.send(result)

}
ControllerUser.crear= async (req,res)=>{
    const {correo,pwd,nombre,apellido,telefono} =req.body //atributos

    const registro=new User({
        correo,
        pwd,
        nombre,
        apellido,
        telefono
    })
    await  registro.save(function (err) {
        if (err)
        {
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
        }

        // Enviamos al cliente la siguiente respuesta con el código HTTP 200.
        res.type('json').status(200).send({ status: "ok", data: "Usuario creado satisfactoriamente!" });
    })

    res.json({
        mensaje:"Registro guardado"
    })


}

ControllerUser.actualizar=(req,res)=>{

    User.findByIdAndUpdate(req.body.id, { $set: req.body }, function (err) {
        if (err)
        {
            //res.send(err);
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el producto con id: "+req.body.id});
        }
        else
        {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Usuario actualizado" });
        }
    });
}

ControllerUser.eliminar=(req,res)=>{
    User.findByIdAndRemove(req.body.id, function(err, data) {
        if (err || !data) {
            //res.send(err);
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.body.id});
        }
        else
        {
            res.status(200).json({ status: "ok", data: "Se ha eliminado correctamente el usuario con id: "+req.body.id});


        }
    });
}

module.exports=ControllerUser
