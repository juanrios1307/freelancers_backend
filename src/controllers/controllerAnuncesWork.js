const ControllerAnunces={}
const AnuncesWorks=require('../models/AnuncesWorks')

ControllerAnunces.obtener = (req,res)=>{

        if (req.params.id)
        {
            AnuncesWorks.findById(req.params.id, function (err, anunce) {
                if (err) {
                    // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                    res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
                } else {
                    // También podemos devolver así la información:
                    res.status(200).json({ status: "ok", data: anunce });
                }
            })
        } else {
            // Ayuda: https://mongoosejs.com/docs/api/model.html
            AnuncesWorks.find({}, function (err, anunces) {
                if (err)
                    // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                    return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

                // También podemos devolver así la información:
                res.status(200).json({ status: "ok", data: anunces });
            })
        }
}

ControllerAnunces.crear = async (req,res)=>{
    const user=req.decoded.sub


    var { profesion, presupuesto, locacion, especificaciones} =req.body //atributos

    const registro=new User({
        user,
        profesion,
        presupuesto,
        locacion,
        especificaciones
    })

    await  registro.save()

    res.json({
        mensaje:"Registro guardado"
    })

}

ControllerAnunces.actualizar=(req, res)=>{

    const user=req.decoded.sub

    AnuncesWorks.findById(req.params.id, function (err, anunces) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(anunces.user == user) {

                AnuncesWorks.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err) {
                    if (err) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                    } else {
                        // Devolvemos el código HTTP 200.
                        res.status(200).json({ status: "ok", data: "anuncio actualizado" });
                    }
                });
            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })

}

ControllerAnunces.eliminar=(req, res)=>{

    const user=req.decoded.sub

    AnuncesWorks.findById(req.params.id, function (err, anunces) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(anunces.user == user) {

                Worker.findByIdAndRemove(req.params.id, function(err, data) {
                    if (err || !data) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
                    }
                    else
                    {
                        res.status(200).json({ status: "ok", data: "Se ha eliminado correctamente el anuncio con id: "+req.params.id});

                    }
                });

            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })

}
module.exports=ControllerAnunces