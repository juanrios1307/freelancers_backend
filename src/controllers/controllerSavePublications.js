const ControllerSave={}
const User=require('../models/User')
const Worker=require('../models/Worker')

ControllerSave.obtener=(req,res)=>{
    const id=req.decoded.sub

    User.findById(id, {"Save":1 ,"_id":0},async function  (err, saves) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));


        var workers=[]

        const pubs=saves.Save

        for(var i=0;i<pubs.length;i++){

            await Worker.findById(pubs[i],function (err,worker){
                if (err)
                    // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                    return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

                // También podemos devolver así la información:
                workers.push(worker)
            }).populate('user')
        }


        res.status(200).json({ status: "ok", data: workers});

    })
}

ControllerSave.crear=(req,res)=>{

    const id=req.decoded.sub
    const {Save}=req.body

    User.findById(id, {"Save":1 ,"_id":0},async function  (err, saves) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(203).send({
                status: "error",
                data: "No se puede procesar la entidad, datos incorrectos!"
            }));


        const pubs = saves.Save
        var bool = false

        for (var i = 0; i < pubs.length; i++) {
            if (pubs[i] == Save) {
                bool = true
            }
        }
        if (bool == false) {
            Worker.findById(Save, function (err, work) {
                if (err || !work) {
                    res.status(203).json({status: "error", data: "No se ha encontrado el worker con id: " + Save});
                } else {
                    User.findByIdAndUpdate(id, {$push: {Save: work}}, function (err) {
                        if (err) {
                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                            res.status(203).json({
                                status: "error",
                                data: "No se ha encontrado el usuario con id: " + id
                            });
                        } else {
                            // Devolvemos el código HTTP 200.
                            res.status(200).json({status: "ok", data: "Worker guardado"});

                        }
                    });
                }
            });
        } else {
            res.status(200).json({status: "ok", data: "El worker ya está guardado"});
        }
    })
}

ControllerSave.eliminar=(req, res)=>{

    const user=req.decoded.sub
    const work=req.params.id

    User.findByIdAndUpdate(user,  {  $pull : { Save : work }}, function (err) {
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(203).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            // Devolvemos el código HTTP 200.
            res.status(200).json({ status: "ok", data: "Worker eliminado" });

        }
    });

}

module.exports=ControllerSave