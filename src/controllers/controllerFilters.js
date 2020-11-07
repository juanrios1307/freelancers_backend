const ControllerFilters={}
const User=require('../models/User')
const Worker=require('../models/Worker')
const Anunce = require('../models/AnuncesWorks')

ControllerFilters.obtenerProfesion = (req,res) =>{

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

ControllerFilters.obtenerYearsExperience= (req,res) =>{

    const profesion=req.headers['profesion']
    const isMayor=req.headers['ismayor']
    const ciudad=req.headers['ciudad']
    const valoracion=req.headers['valoracion']

    if(profesion != undefined && ciudad != '') {
        // Se buscan todas las profesiones
        Worker.find({profesion: {$regex: "^" + profesion}}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            else {

                var cities = []

                for (var i = 0; i < workers.length; i++) {
                    if (workers[i].user.ciudad == ciudad) {
                        cities.push(workers[i])
                    }
                }

                res.status(200).json({
                    status: "ok",
                    data: cities
                });
            }
        }).populate('user').sort({"yearsXperience": (isMayor == "true" ? -1 : 1)}).sort({"promedio": (valoracion == "true" ? -1 : 1)})
    }else {

        // Se buscan todas las profesiones
        Worker.find({profesion: {$regex: "^" + profesion}}, function (err, workers) {
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
        }).populate('user').sort({"yearsXperience": (isMayor == "true" ? -1 : 1)}).sort({"promedio": (valoracion == "true" ? -1 : 1)})
    }
}


ControllerFilters.obtenerPromedio =(req,res)=>{

    const profesion=req.headers['profesion']
    const isMayor=req.headers['ismayor']
    const ciudad=req.headers['ciudad']
    const years=req.headers['years']

    if(profesion != undefined && ciudad != '') {
        // Se buscan todas las profesiones
        Worker.find({profesion: {$regex: "^" + profesion}}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));
            else {

                var cities = []

                for (var i = 0; i < workers.length; i++) {
                    if (workers[i].user.ciudad == ciudad) {
                        cities.push(workers[i])
                    }
                }

                res.status(200).json({
                    status: "ok",
                    data: cities
                });
            }
        }).populate('user').sort({"promedio": (isMayor == "true" ? -1 : 1)}).sort({"yearsXperience": (years == "true" ? -1 : 1)});


    }else {

        Worker.find({profesion: {$regex: "^" + profesion}}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            // También podemos devolver así la información:
            res.status(200).json({status: "ok", data: workers});

        }).populate('user').sort({"promedio": (isMayor == "true" ? -1 : 1)}).sort({"yearsXperience": (years == "true" ? -1 : 1)});
    }
}


ControllerFilters.obtenerCiudades= (req,res) =>{
    const profesion=req.headers['profesion']
    const ciudad=req.headers['ciudad']
    const years=req.headers['years']
    const valoracion=req.headers['valoracion']

    if(profesion != undefined && ciudad != undefined){
        // Se buscan todas las profesiones
        Worker.find({ profesion : {$regex : "^"+profesion }}, function (err, workers) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                var cities=[]

                for(var i=0;i<workers.length;i++){
                    if(workers[i].user.ciudad==ciudad){
                        cities.push(workers[i])
                    }
                }

                res.status(200).json({
                    status: "ok",
                    data: cities
                });
            }
        }).populate('user').sort({"promedio": (valoracion == "true" ? -1 : 1)}).sort({"yearsXperience": (years == "true" ? -1 : 1)});

    }else{



        User.distinct("ciudad",function (err,ciudad) {
           if(err){
               console.log(err)

               res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" });
           } else{
               res.status(200).json({data:ciudad})
           }
        })


    }

}

ControllerFilters.obtenerCiudadesAnunces= (req,res) => {
    const profesion=req.headers['profesion']
    const ciudad=req.headers['ciudad']
    const presupuesto=req.headers['presupuesto']
    const fecha=req.headers['fecha']

    if(profesion != undefined && ciudad != undefined){
        // Se buscan todas las profesiones

        Anunce.find({$and: [{ profesion : {$regex : "^"+profesion }}, {"ciudad": ciudad}]}, function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                res.status(200).json({
                    status: "ok",
                    data: anunces
                });
            }
        }).populate('user').sort({"date": (fecha == "true" ? -1 : 1)}).sort({"presupuesto": (presupuesto == "true" ? -1 : 1)});

    }else{

        Anunce.distinct("ciudad",function (err,ciudad) {
            if(err){
                console.log(err)

                res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" });
            } else{
                res.status(200).json({data:ciudad})
            }
        })


    }
}

ControllerFilters.obtenerPresupuesto= (req,res) =>{
    const profesion=req.headers['profesion']
    const isMayor=req.headers['ismayor']

    const ciudad=req.headers['ciudad']
    const fecha=req.headers['fecha']

    if(ciudad != ''){
        Anunce.find({$and: [{ profesion : {$regex : "^"+profesion }}, {"ciudad": ciudad}]}, function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                res.status(200).json({
                    status: "ok",
                    data: anunces
                });
            }
        }).populate('user').sort({"presupuesto": (isMayor == "true" ? -1 : 1)}).sort({"date": (fecha == "true" ? -1 : 1)});

    }else {

        Anunce.find({profesion: {$regex: "^" + profesion}}, function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            // También podemos devolver así la información:
            res.status(200).json({status: "ok", data: anunces});

        }).populate('user').sort({"presupuesto": (isMayor == "true" ? -1 : 1)}).sort({"date": (fecha == "true" ? -1 : 1)});
    }
}


ControllerFilters.obtenerFecha = (req,res) =>{
    const profesion=req.headers['profesion']
    const isMayor=req.headers['ismayor']

    const ciudad=req.headers['ciudad']
    const presupuesto=req.headers['presupuesto']

    if(ciudad != ''){
        Anunce.find({$and: [{ profesion : {$regex : "^"+profesion }}, {"ciudad": ciudad}]}, function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));
            else {

                res.status(200).json({
                    status: "ok",
                    data: anunces
                });
            }
        }).populate('user').sort({"date": (isMayor == "true" ? -1 : 1)}).sort({"presupuesto": (presupuesto == "true" ? -1 : 1)});

    }else {

        Anunce.find({profesion: {$regex: "^" + profesion}}, function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            // También podemos devolver así la información:
            res.status(200).json({status: "ok", data: anunces});

        }).populate('user').sort({"date": (isMayor == "true" ? -1 : 1)}).sort({"presupuesto": (presupuesto == "true" ? -1 : 1)});
    }
}



//Se exporta controlador
module.exports=ControllerFilters