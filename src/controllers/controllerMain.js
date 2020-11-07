const ControllerMain={}
const Worker=require('../models/Worker')
const AnuncesWorks = require("../models/AnuncesWorks");


ControllerMain.obtenerProfesiones = (req, res) =>{

    if(req.headers['profesion']){
        const profesion=req.headers['profesion']
        console.log(profesion)


        Worker.find( { profesion : {$regex : "^"+profesion } } , {"profesion": 1}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            // También podemos devolver así la información:
            res.status(200).json({
                status: "ok",
                data: workers
            });
        });
    }else {

        // Se buscan todas las profesiones
        Worker.find({}, {"profesion": 1, "_id": 0}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            // También podemos devolver así la información:
            res.status(200).json({
                status: "ok",
                data: workers
            });
        });
    }
}

ControllerMain.obtenerWorkers =(req,res)=>{

    const profesion=req.headers['profesion']
    const id=req.headers['id']

    const years=req.headers['years']
    const valoracion=req.headers['valoracion']



    if(profesion && profesion!="null"){
        const profesion=req.headers['profesion']
        console.log(profesion)


        Worker.find( { profesion : {$regex : "^"+profesion } } , function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: workers });
        }).populate('user').sort({"promedio": (valoracion == "true" ? -1 : 1)}).sort({"yearsXperience": (years == "true" ? -1 : 1)});

    }else {
        if(id && id!="null"){
            //si se envia la peticion con parametros
            Worker.findById(id, function (err, worker) {
                if (err) {
                    // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                    res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+id});
                } else {

                    res.status(200).json({ status: "ok", data: worker });

                }
            }).populate('user')

        }else {
            // se buscan todos los Workers
            Worker.find({}, function (err, workers) {
                if (err)
                    // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                    return (res.type('json').status(422).send({
                        status: "error",
                        data: "No se puede procesar la entidad, datos incorrectos!"
                    }));

                // También podemos devolver así la información:
                res.status(200).json({status: "ok", data: workers});
            }).populate('user').sort({"promedio": (valoracion == "true" ? -1 : 1)}).sort({"yearsXperience": (years == "true" ? -1 : 1)});
        }
    }

}

ControllerMain.obtenerPromotedWorkers =(req,res)=>{

        // se buscan 3 de los Workers prom
        Worker.find({}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: workers });
        }).populate('user').sort({"promedio":-1}).limit(3);
}


ControllerMain.obtenerAnunces =(req,res)=>{

    const profesion=req.headers['profesion']
    const id=req.headers['id']
    const presupuesto=req.headers['presupuesto']
    const fecha=req.headers['fecha']

    if(profesion && profesion!="null"){
        const profesion=req.headers['profesion']
        console.log(profesion)


        AnuncesWorks.find( { profesion : {$regex : "^"+profesion } } , function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: anunces });
        }).populate('user').sort({"date": (fecha == "true" ? -1 : 1)}).sort({"presupuesto": (presupuesto == "true" ? -1 : 1)});

    }else {
        if (id && id != "null") {
            //si se envia la peticion con parametros
            AnuncesWorks.findById(id, function (err, anunces) {
                if (err) {
                    // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                    res.status(404).json({status: "error", data: "No se ha encontrado el anunce con id: " + id});
                } else {

                    res.status(200).json({status: "ok", data: anunces});

                }
            }).populate('user')

        } else {

            // se buscan todos los Workers
            AnuncesWorks.find({}, function (err, anunces) {
                if (err)
                    // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                    return (res.type('json').status(422).send({
                        status: "error",
                        data: "No se puede procesar la entidad, datos incorrectos!"
                    }));

                // También podemos devolver así la información:
                res.status(200).json({status: "ok", data: anunces});
            }).populate('user').sort({"presupuesto": (presupuesto == "true" ? -1 : 1)}).sort({"date": (fecha == "true" ? 1 : -1)});;

        }
    }

}

module.exports=ControllerMain