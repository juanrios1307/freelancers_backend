const ControllerAnunces={}
const AnuncesWorks=require('../models/AnuncesWorks')
const User=require('../models/User')

ControllerAnunces.obtener = (req,res)=>{

    const user=req.decoded.sub
    if(req.params.id) {
        AnuncesWorks.findById(req.params.id, function (err, anunces) {
            if (err) {
                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(203).json({
                    status: "error",
                    data: "No se ha encontrado el anuncio con id: " + req.params.id
                });
            } else {
                // También podemos devolver así la información:
                if (anunces.user == user) {

                    // También podemos devolver así la información:
                    res.status(200).json({status: "ok", data: anunces});

                } else {
                    res.status(203).json({status: "error", data: "El id no corresponde a tu peticion: "});
                }

            }
        })
    }else{
        User.findById(user, {"Anunces":1 ,"_id":0},async function  (err, anunce) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            var anuncios=[]

            const pubs=anunce.Anunces

            for(var i=0;i<pubs.length;i++){

                await AnuncesWorks.findById(pubs[i],function (err,anunces){
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

                    // También podemos devolver así la información:
                    anuncios.push(anunces)
                }).populate('user')
            }

            res.status(200).json({ status: "ok", data: anuncios});

        })
    }

}

ControllerAnunces.crear = async (req,res)=>{
    const user=req.decoded.sub

    var { titulo, profesion, presupuesto, ciudad, especificaciones,imagen} =req.body //atributos

    titulo=titulo.toLowerCase()
    profesion=profesion.toLowerCase()
    especificaciones=especificaciones.toLowerCase()
    ciudad=ciudad.toLowerCase()

    const registro=new AnuncesWorks({
        user,
        titulo,
        profesion,
        presupuesto,
        ciudad,
        especificaciones,
        imagen,
        Vistas: [],
    })

    await  registro.save()

    User.findByIdAndUpdate(user,  {  $push : { Anunces : registro.id }}, function (err) {
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Anuncio guardado" });

        }
    });

}

ControllerAnunces.actualizar=(req, res)=>{

    const user=req.decoded.sub

    AnuncesWorks.findById(req.params.id, function (err, anunces) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(anunces.user == user) {

                AnuncesWorks.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err) {
                    if (err) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(203).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                    } else {
                        // Devolvemos el código HTTP 200.
                        res.status(200).json({ status: "ok", data: "Anuncio actualizado" });
                    }
                });
            }else{
                res.status(203).json({ status: "error", data: "El id no corresponde a tu peticion: "});
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

                AnuncesWorks.findByIdAndRemove(req.params.id, function(err, data) {
                    if (err || !data) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                        res.status(203).json({ status: "error", data: "No se ha encontrado el anuncio con id: "+req.params.id});
                    }
                    else
                    {
                        res.status(200).json({ status: "ok", data: "Anuncio eliminado"});

                    }
                });

            }else{
                res.status(203).json({ status: "error", data: "El id no corresponde a tu peticion: "});
            }

        }
    })

}

ControllerAnunces.views =(req,res)=>{

    const user=req.decoded.sub

    const vista={
        user:user
    }


    AnuncesWorks.findById(req.params.id, function (err, anunce) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el anunce con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            if(anunce.user == user) {

                res.status(200).json({ status: "ok", data: "Recuerda, tus visitas no seran contabilizadas!!" });

            }else{


                AnuncesWorks.findByIdAndUpdate(req.params.id, {$push: {Vistas: vista}}, function (err) {
                    if (err) {
                        //res.send(err);
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(203).json({ status: "error", data: "No se ha encontrado el anunce con id: "+req.params.id});
                    } else {

                        res.status(200).json({ status: "ok", data: "Vista Guardada en anuncio!!" });
                    }
                });
            }

        }
    })
}
module.exports=ControllerAnunces