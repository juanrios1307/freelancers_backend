const ControllerContact={}
const Message=require('../models/ContactMessage')
const nodemailer = require('nodemailer');
const Worker=require('../models/Worker')
const User=require('../models/User')


ControllerContact.obtener= async (req,res) =>{

    const user=req.decoded.sub

   await Message.find({user}, function (err, messages) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
                res.status(200).json({ status: "ok", data: messages });
        }
    });

}

ControllerContact.crear= async (req,res)=>{

    //Se recibe el id del trabajador buscado
    const worker=req.params.id
    const user=req.decoded.sub

    //Se reciben los datos a enviar
    const {mensaje,asunto} =req.body //atributos

    Worker.findById(worker, function (err, worker) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'quickservices20202@gmail.com',
                    pass: '2juan1santiago'
                }
            });

            User.findById(worker.user, function (err, user) {
                if (err) {
                    // Devolvemos el código HTTP 404, de producto no encontrado por su id.
                    res.status(404).json({ status: "error", data: "No se ha encontrado el worker con id: "+req.params.id});
                } else {
                    var mailOptions = {
                        from: 'quickservices20202@gmail.com',
                        to: user.correo,
                        subject: asunto,
                        text: mensaje
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            res.status(404).json({ status: "error", data: error});
                        } else {
                            res.status(200).json({ status: "ok", data: "Formulario enviado"});
                        }
                    });
                }

            }
            )

        }
    }).populate('user')



}

//Se exporta el controlador
module.exports=ControllerContact