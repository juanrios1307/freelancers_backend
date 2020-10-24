const ControllerChat={}
const Chat=require('../models/Chat')
const User = require('../models/User')
const Worker = require('../models/Worker')

ControllerChat.crear = async (req,res)=> {
    const user=req.decoded.sub
    const worker=req.params.id

    const {mensaje,emisor} =req.body

    const Mensaje={mensaje,emisor}

            // Devolvemos el código HTTP 200.
            Worker.findById(worker,function (err,worker) {
                if (err) {
                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                    res.status(404).json({status: "error", data: "No se ha encontrado el usuario con id: " + user});
                } else {
                    const registro = new Chat({
                        user,
                        worker: worker.user,
                        Mensajes: []
                    })

                    registro.save()
                    User.findByIdAndUpdate(user, {$push: {Chats: registro.id}}, function (err) {
                        if (err) {
                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                            res.status(404).json({
                                status: "error",
                                data: "No se ha encontrado el usuario con id: " + user
                            });
                        } else {

                            User.findByIdAndUpdate(worker.user, {$push: {Chats: registro.id}}, function (err) {
                                if (err) {
                                    // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                    res.status(404).json({
                                        status: "error",
                                        data: "No se ha encontrado el usuario con id: " + user
                                    });
                                } else {

                                    Chat.findByIdAndUpdate(registro.id, {$push: {Mensajes: Mensaje}}, function (err) {
                                        if (err) {
                                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                            res.status(404).json({
                                                status: "error",
                                                data: "No se ha encontrado el usuario con id: " + user
                                            });
                                        } else {
                                            res.status(200).json({status: "ok", data: "Mensaje guardado in list"});
                                        }

                                    });
                                }
                            });

                        }
                    });
                }
            });
}

ControllerChat.actualizar = async (req,res)=> {
    const user=req.decoded.sub
    const id=req.params.id

    console.log("id: "+user)

    const {mensaje} =req.body


    Chat.findById(id,function (err,chat){
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {
            console.log("ID user: "+chat.user)
            console.log("ID worker: "+chat.worker)


            var Mensaje
            if(chat.user==user || chat .worker==user){
                if(chat.user==user){

                    Mensaje={
                        mensaje,
                        emisor:"user"
                    }
                }else if(chat.worker==user){

                    Mensaje={
                        mensaje,
                        emisor:"worker"
                    }
                }
                Chat.findByIdAndUpdate(id,{  $push : { Mensajes : Mensaje}}, function (err) {
                    if (err) {
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
                    } else {
                        res.status(200).json({ status: "ok", data: "Mensaje guardado in list" });
                    }

                })

            }else{
                res.status(404).json({ status: "error", data: "El id no corresponde al chat: "});
            }


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
                if (chat.user == user ) {
                    var r=[]
                    r.push({"isUser":true})
                    r.push(chat)
                    // También podemos devolver así la información:
                    res.status(200).json({status: "ok", data: r});

                }else if(chat.worker == user){
                    var r=[]
                    r.push({"isUser":false})
                    r.push(chat)
                    // También podemos devolver así la información:
                    res.status(200).json({status: "ok", data: r});

                } else {

                    res.status(404).json({status: "error", data: "ID user: "+chat.user + " ID worker: "+chat.worker+ " ID: "+user});
                }

            }
        })
    }else {

        Chat.find({"user": user}, async function (err, mensajesU) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            else {
                Chat.find({"worker": user}, async function (err, mensajesW) {
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(422).send({
                            status: "error",
                            data: "No se puede procesar la entidad, datos incorrectos!"
                        }));

                    else {
                        var mensajes=[]

                        mensajes.push(mensajesU)
                        mensajes.push(mensajesW)

                        res.status(200).json({status: "ok", data: mensajes});
                    }
                }).populate("worker")
            }
        }).populate("user")
    }
}

module.exports=ControllerChat