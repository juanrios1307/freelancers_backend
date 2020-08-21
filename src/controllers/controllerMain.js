const ControllerMain={}
const Worker=require('../models/Worker')

ControllerMain.obtener = (req,res) =>{

    // Ayuda: https://mongoosejs.com/docs/api/model.html
    Worker.find({},{"profesion":1 ,"_id":0}, function (err, workers) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: workers });
    });
}

module.exports=ControllerMain