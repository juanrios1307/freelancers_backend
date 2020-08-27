const ControllerSignUpWorker={}
const User=require('../models/User')
const Worker=require('../models/Worker')
const ControllerUser =require('./controllerSignUpUsers')

ControllerSignUpWorker.obtener = (req, res) =>{

    if (req.params.id) {
        Worker.findById(req.params.id, function (err, worker) {
            if (err) {
                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
            } else {
                // También podemos devolver así la información:
                User.findById(req.body.userID, function (err, user) {
                    if (err) {
                        // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.body.userID});
                    } else {
                        res.status(200).json({ status: "ok", data: user });
                    }

                })

            }
        })
    } else {
        // Ayuda: https://mongoosejs.com/docs/api/model.html
        Worker.find({}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: workers });
        }).populate('user');
    }
}

ControllerSignUpWorker.crear= async (req, res)=>{
    const {_id,correo,pwd,nombre,apellido,telefono,profesion,yearsXperience,titulo,experiencia,imagen} =req.body //atributos

    const user=new User({
        _id,
        isWorker:true,
        correo,
        pwd,
        nombre,
        apellido,
        telefono
    })
    await  user.save()

  /*  res.json({
        mensaje:"Worker guardado"
    })*/

    const worker=new Worker({
        user: user._id,
        profesion,
        yearsXperience,
        experiencia,
        titulo,
        imagen
    })
    await worker.save()
    res.status(200).json({ status: "ok", data: "Worker guardado"});
}


ControllerSignUpWorker.actualizar=(req, res)=>{

    Worker.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err) {
        if (err)
        {
            //res.send(err);
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        }
        else
        {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Usuario actualizado" });
        }
    });
}

ControllerSignUpWorker.eliminar=(req, res)=>{


    Worker.findByIdAndRemove(req.params.id, function(err, data) {
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


module.exports=ControllerSignUpWorker
