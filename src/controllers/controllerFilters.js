const ControllerMain={}
const User=require('../models/User')
const Worker=require('../models/Worker')

ControllerMain.obtenerProfesion = (req,res) =>{

    const profesion= req.body

    // Se buscan todas las profesiones
    Worker.find({"profesion":profesion }, function (err, workers) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({
            status: "ok",
            data: workers
        });
    });
}

ControllerMain.obtenerYearsExperience= (req,res) =>{

    const years= req.body

    // Se buscan todas las profesiones
    Worker.find({"yearsExperience":{$gt: years} }, function (err, workers) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({
            status: "ok",
            data: workers
        });
    });
}

ControllerMain.obtenerTitulo= (req,res) =>{

    const need= req.body

    // Se buscan todas las profesiones
    Worker.find({"titulo":{$exists: need} }, function (err, workers) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({
            status: "ok",
            data: workers
        });
    });
}

//Se exporta controlador
module.exports=ControllerMain