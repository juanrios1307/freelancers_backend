const ControllerContact={}
const User=require('../models/User')
const Worker=require('../models/Worker')

ControllerContact.obtener=(req,res)=>{
    const id=req.decoded.sub

    User.findById(id, {"Save":1 ,"_id":0},function (err, saves) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        // También podemos devolver así la información:
        res.status(200).json({ status: "ok", data: saves });
    })

}

ControllerContact.crear=(req,res)=>{

    const id=req.decoded.sub
    const worker=req.body.Save

    Worker.findById(worker,function (err,work){
        if(err){
            res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+worker});
        }else{
            User.findByIdAndUpdate(id,  {  $push : { Save : {worker} }}, function (err) {
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+id});
                } else {
                    // Devolvemos el código HTTP 200.
                    res.status(200).json({ status: "ok", data: "Worker guardado in list" });
                }
            });
        }
    });

}

module.exports=ControllerContact