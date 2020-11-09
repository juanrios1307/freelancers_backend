const ControllerContact={}
const nodemailer = require('nodemailer');
const Worker=require('../models/Worker')
const Anunce=require('../models/AnuncesWorks')
const User=require('../models/User')


ControllerContact.crear= async (req,res)=>{

    //Se recibe el id del trabajador buscado
    const id=req.params.id
    const user=req.decoded.sub

    //Se reciben los datos a enviar
    const {mensaje,asunto,isWorker} =req.body //atributos

    if(isWorker===true) {

        Worker.findById(id, function (err, worker) {
            if (err || worker == null) {

                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(404).json({status: "error", data: "No se ha encontrado el id con id: " + req.params.id});
            } else {
                // También podemos devolver así la información:
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'quickservices20202@gmail.com',
                        pass: '2Juan1Santiago'
                    }
                });

                User.findById(worker.user, function (err, user) {
                        if (err) {

                            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                            res.status(404).json({
                                status: "error",
                                data: "No se ha encontrado el id con id: " + req.params.id
                            });
                        } else {
                            var mailOptions = {
                                from: 'quickservices20202@gmail.com',
                                to: user.correo,
                                subject: asunto,
                                text: mensaje
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {

                                    res.status(404).json({status: "error", data: error});
                                } else {
                                    res.status(200).json({status: "ok", data: "Formulario enviado"});
                                }
                            });
                        }

                    }
                )

            }
        }).populate('user')
    }else{



        Anunce.findById(id, function (err, anunce) {
            if (err || anunce == null) {
                // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                res.status(404).json({status: "error", data: "No se ha encontrado el id con id: " + req.params.id});
            } else {
                // También podemos devolver así la información:
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'quickservices20202@gmail.com',
                        pass: '2Juan1Santiago'
                    }
                });

                User.findById(anunce.user, function (err, user) {
                        if (err) {

                            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                            res.status(404).json({
                                status: "error",
                                data: "No se ha encontrado el id con id: " + req.params.id
                            });
                        } else {
                            var mailOptions = {
                                from: 'quickservices20202@gmail.com',
                                to: user.correo,
                                subject: asunto,
                                text: mensaje
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {

                                    res.status(404).json({status: "error", data: error});
                                } else {
                                    res.status(200).json({status: "ok", data: "Formulario enviado"});
                                }
                            });
                        }

                    }
                )

            }
        }).populate('user')
    }


}

//Se exporta el controlador
module.exports=ControllerContact