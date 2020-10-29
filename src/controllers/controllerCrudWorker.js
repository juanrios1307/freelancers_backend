const ControllerWorker={}
const bcrypt = require('bcryptjs');
const User=require('../models/User')
const Worker=require('../models/Worker')
const fs=require('fs')

ControllerWorker.obtener = (req, res) =>{

    const user=req.decoded.sub
    //si se envia la peticion con parametros
    Worker.findById(req.params.id, function (err, worker) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(worker.user == user) {

                Worker.findById(user, function (err, worker) {
                    if (err) {
                        // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                    } else {
                        // También podemos devolver así la información:
                        res.status(200).json({ status: "ok", data: worker });
                    }
                })
            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    }).populate('user')

}

ControllerWorker.crear= async (req, res)=>{

    //Se inicializan datos a guardar
    var {profesion,yearsXperience,experiencia,imagen} =req.body //atributos

    profesion=profesion.toLowerCase()
    experiencia=experiencia.toLowerCase()

    const user=req.decoded.sub

    User.findByIdAndUpdate(user, { isWorker: true },async function (err) {
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        }
        else {

            //Se crea modelo de trabajador y se sube a DB
            const worker=new Worker({
                user,
                profesion,
                yearsXperience,
                experiencia,
                imagen,
                promedio:"0",
                Comments:[]
            })
            await worker.save()
            //Se envia respuesta
            res.status(200).json({ status: "ok", data: "Worker guardado"});
        }
    });


}


ControllerWorker.actualizar=(req, res)=>{

    const user=req.decoded.sub

    Worker.findById(req.params.id, function (err, worker) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(worker.user == user) {

                Worker.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err) {
                    if (err) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                    } else {
                        // Devolvemos el código HTTP 200.
                        res.status(200).json({ status: "ok", data: "Usuario actualizado" });
                    }
                });
            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })

}

ControllerWorker.eliminar=(req, res)=>{

    const user=req.decoded.sub

    Worker.findById(req.params.id, function (err, worker) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(worker.user == user) {

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

            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })



}

//Se exporta controlador
module.exports=ControllerWorker
