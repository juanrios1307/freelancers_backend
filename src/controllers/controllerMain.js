const ControllerMain={}
const Worker=require('../models/Worker')
const AnuncesWorks = require("../models/AnuncesWorks");


ControllerMain.obtenerProfesiones = (req, res) =>{

    if(req.headers['profesion']){
        const profesion=req.headers['profesion']
        console.log(profesion)


        Worker.find({profesion}, {"profesion": 1}, function (err, workers) {
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

        console.log("No")
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

    if(req.headers['profesion']){
        const profesion=req.headers['profesion']
        console.log(profesion)


        Worker.find({profesion}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: workers });
        }).populate('user');

    }else {

        console.log("No")
        // se buscan todos los Workers
        Worker.find({}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: workers });
        }).populate('user');

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
        }).populate('user').limit(3);


}


ControllerMain.obtenerAnunces =(req,res)=>{

    if(req.headers['profesion']){
        const profesion=req.headers['profesion']
        console.log(profesion)


        AnuncesWorks.find({profesion}, function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: anunces });
        }).populate('user');

    }else {

        console.log("No")
        // se buscan todos los Workers
        AnuncesWorks.find({}, function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            res.status(200).json({ status: "ok", data: anunces });
        }).populate('user');

    }

}

module.exports=ControllerMain