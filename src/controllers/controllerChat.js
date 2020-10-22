const ControllerChat={}
const Chat=require('../models/Chat')
const User = require('../models/User')

ControllerChat.crear = async (req,res)=> {
    const user=req.decoded.sub
    const worker=req.params.id

    const {mensaje,emisor} =req.body

    const Mensaje={mensaje,emisor}

    const registro=new Chat({
            user,
            worker,
            Mensajes:[]
        })

    registro.save()

    User.findByIdAndUpdate(user,{  $push : { Chats : registro.id }}, function (err) {
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            // Devolvemos el código HTTP 200.
           Chat.findByIdAndUpdate(registro.id,{  $push : { Mensajes : Mensaje}}, function (err) {
               if (err) {
                   // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                   res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
               } else {
                   res.status(200).json({ status: "ok", data: "Mensaje guardado in list" });
               }

           })

        }
    });
}

ControllerChat.actualizar = async (req,res)=> {
    const user=req.decoded.sub
    const id=req.params.id


    const {mensaje,emisor} =req.body
    const Mensaje={mensaje,emisor}

    Chat.findByIdAndUpdate(id,{  $push : { Mensajes : Mensaje}}, function (err) {
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            res.status(200).json({ status: "ok", data: "Mensaje guardado in list" });
        }

    })

}

ControllerChat.obtener = async (req,res)=>{
    const user=req.decoded.sub

    if(req.params.id){
        Chat.findById(req.params.id, function (err, chat) {
            if (err) {
                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(404).json({
                    status: "error",
                    data: "No se ha encontrado el chat con id: " + req.params.id
                });
            } else {
                // También podemos devolver así la información:
                if (chat.user == user || chat.worker.user == user) {

                    // También podemos devolver así la información:
                    res.status(200).json({status: "ok", data: chat});

                } else {
                    res.status(404).json({status: "error", data: "El id no corresponde a tu peticion: "});
                }

            }
        }).populate("worker")
    }else {

        Chat.find({"user": user}, async function (err, mensajes) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            else
                res.status(200).json({status: "ok", data: mensajes});

        }).populate("worker").populate("user")
    }
}

module.exports=ControllerChat