const ControllerChat={}
const Chat=require('../models/Chat')
const User = require('../models/User')
const Worker = require('../models/Worker')
const Anunce = require('../models/AnuncesWorks')

ControllerChat.crear = async (req,res)=> {
    const user=req.decoded.sub ;
    const id=req.params.id ;
    const isWorker= req.headers['isworker'] ;

    console.log("isworker?"+isWorker)

    if(isWorker == "true" ) {
        console.log("IsWorker")
        Worker.findById(id, async function (err, worker) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            else {
                Chat.find({$and: [{"user": user}, {"worker": worker.user}]}, function (err, chat) {
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422
                        return (res.type('json').status(422).send({
                            status: "error",
                            data: "No se puede procesar la entidad, datos incorrectos!"
                        }));

                    else {
                        if (chat.length == 0) {

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

                                            res.status(200).json({
                                                status: "ok",
                                                data: "Chat creado",
                                                id: registro.id
                                            });
                                        }
                                    });

                                }
                            });

                        } else {
                            // También podemos devolver así la información:
                            res.status(200).json({status: "ok", data: "Chat creado anteriormente", id: chat[0]._id});

                        }
                    }
                })
            }
        })
    }else{
        console.log("IsAnunce")
        Anunce.findById(id, async function (err, anunces) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422
                return (res.type('json').status(422).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            else {
                Chat.find({$and: [{"user": user}, {"worker": anunces.user}]}, function (err, chat) {
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422
                        return (res.type('json').status(422).send({
                            status: "error",
                            data: "No se puede procesar la entidad, datos incorrectos!"
                        }));

                    else {
                        if (chat.length == 0) {

                            const registro = new Chat({
                                user,
                                worker: anunces.user,
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

                                    User.findByIdAndUpdate(anunces.user, {$push: {Chats: registro.id}}, function (err) {
                                        if (err) {
                                            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                                            res.status(404).json({
                                                status: "error",
                                                data: "No se ha encontrado el usuario con id: " + user
                                            });
                                        } else {

                                            res.status(200).json({
                                                status: "ok",
                                                data: "Chat creado",
                                                id: registro.id
                                            });
                                        }
                                    });

                                }
                            });

                        } else {
                            // También podemos devolver así la información:
                            res.status(200).json({status: "ok", data: "Chat creado anteriormente", id: chat[0]._id});

                        }
                    }
                })
            }
        })
    }
}

ControllerChat.actualizar = async (req,res)=> {
    const user=req.decoded.sub
    const id=req.params.id

    const {mensaje} =req.body


    Chat.findById(id,function (err,chat){
        if (err) {
            // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+user});
        } else {

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
                        res.status(200).json({ status: "ok", data: "Mensaje enviado" });
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
        await Chat.findById(req.params.id,function (err,chat){
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            // También podemos devolver así la información:
            if(chat.user.id==user || chat.worker.id==user) {

                var respuesta=[]

                if (chat.user.id == user) {
                    respuesta.push({"isUser":true})

                } else if (chat.worker.id == user) {
                    respuesta.push({"isUser":false})
                }

                respuesta.push(chat)
                // También podemos devolver así la información:
                res.status(200).json({status: "ok", data: respuesta});

            }else{
                res.status(404).json({status: "error", data: "El id no corresponde"});
            }
        }).populate('user').populate('worker')

    }else {

        User.findById(user, {"Chats":1 ,"_id":0},async function  (err, idChat) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

            var chats=[]
            var isUser=[]

            const pubs=idChat.Chats

            for(var i=0;i<pubs.length;i++){

                await Chat.findById(pubs[i],function (err,chat){
                    if (err)
                        // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                        return (res.type('json').status(422).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

                    // También podemos devolver así la información:
                    chats.push(chat)


                    if (chat.user.id == user ) {
                        isUser.push(true)

                    }else if(chat.worker.id == user) {
                        isUser.push(false)
                    }

                }).populate('user').populate('worker')
            }

            res.status(200).json({ status: "ok", data: chats, bool:isUser});

        })
    }
}

module.exports=ControllerChat