const ControllerWorker={}
const bcrypt = require('bcryptjs');
const User=require('../models/User')
const Worker=require('../models/Worker')
const fs=require('fs')

ControllerWorker.obtener = (req, res) =>{

    const user=req.decoded.sub
    //si se envia la peticion con parametros
    if(req.params.id){

        Worker.findById(req.params.id, function (err, worker) {
            if (err) {
                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(203).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
            } else {
                // También podemos devolver así la información:
                if(worker.user == user) {

                    Worker.findById(user, function (err, worker) {
                        if (err) {
                            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                            res.status(203).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                        } else {
                            // También podemos devolver así la información:
                            res.status(200).json({ status: "ok", data: worker });
                        }
                    })
                }else{
                    res.status(203).json({ status: "error", data: "El id no corresponde a tu peticion: "});
                }

            }
        }).populate('user')


    }else{
        User.findById(user, {"Workers":1 ,"_id":0},async function  (err, worker) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            var workers=[]

            const pubs=worker.Workers

            for(var i=0;i<pubs.length;i++){

                await Worker.findById(pubs[i],function (err,work){
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

                    // También podemos devolver así la información:
                    workers.push(work)
                }).populate('user')
            }

            res.status(200).json({ status: "ok", data: workers});

        })
    }

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
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
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
                Comments:[],
                Vistas:[],
            })
            await worker.save()

            User.findByIdAndUpdate(user,  {  $push : { Workers : worker.id }}, function (err) {
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                } else {
                    // Devolvemos el código HTTP 200.
                    res.status(200).json({ status: "ok", data: "Worker guardado" });

                }
            });

        }
    });


}


ControllerWorker.actualizar=(req, res)=>{

    const user=req.decoded.sub

    Worker.findById(req.params.id, function (err, worker) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(worker.user == user) {

                Worker.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err) {
                    if (err) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(203).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                    } else {
                        // Devolvemos el código HTTP 200.
                        res.status(200).json({ status: "ok", data: "Worker actualizado" });
                    }
                });
            }else{
                res.status(203).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })

}

ControllerWorker.views = (req,res)=>{

    const user=req.decoded.sub

    const vista={
        user:user
    }

    const workerb={
        worker:req.params.id
    }

    Worker.findById(req.params.id, function (err, worker) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(worker.user == user) {

                res.status(200).json({ status: "ok", data: "Recuerda, tus visitas no seran contabilizadas!!" });

            }else{


                Worker.findByIdAndUpdate(req.params.id, {$push: {Vistas: vista}}, function (err) {
                    if (err) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(203).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                    } else {

                        User.findByIdAndUpdate(user, {$push: {WorkersBuscados: workerb}}, function (err) {
                            if (err) {
                                //res.send(err);
                                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                res.status(203).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                            } else {
                                // Devolvemos el código HTTP 200.
                                res.status(200).json({ status: "ok", data: "vista guardada" });
                            }
                        });
                    }
                });
            }

        }
    })
}

ControllerWorker.eliminar=(req, res)=>{
    console.log("ENTRA")
    const user=req.decoded.sub

    const worker=req.params.id

    Worker.findById(worker, function (err, products) {
        if (err) {
            // Devolvemos el código HTTP 404, de worker no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            console.log(products)
            if(products.user == user) {

                Worker.findByIdAndRemove(worker, function(err, data) {
                    if (err || !data) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de worker no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                    }
                    else
                    {
                        User.findByIdAndUpdate(user,  {  $pull : { Workers : worker }}, function (err) {
                            if (err) {
                                // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                            } else {

                                User.update({"Save":worker},{$pull : {"Save":worker}},{multi:true},function(err){
                                    if(err){
                                        res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                                    } else {
                                        // Devolvemos el código HTTP 200.
                                        res.status(200).json({ status: "ok", data: "Worker eliminado satisfactoriamente" });

                                    }
                                })

                            }
                        });


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
