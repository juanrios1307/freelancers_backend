const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51IKU2KGfY2o0HPMw3tWMGq79tTArmxJQUwhp0eXFjKtg3z37EA7EoyXv5e5k0yVsGVQhUTRNQNJ4J5RXm4zqCaYj007dcPEafm");

const User=require('../models/User')

const ControllerMemberships={}

ControllerMemberships.crearPago =async (req,res)=>{
    const user=req.decoded.sub
    const { id, amount,description } = req.body;

    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: description,
            payment_method: id,
            confirm: true, //confirma el pago
        });

        User.findById(user,{"Membresias":1 ,"_id":0},async function  (err, memberships) {
            if (err)
                // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
                return (res.type('json').status(203).send({
                    status: "error",
                    data: "No se puede procesar la entidad, datos incorrectos!"
                }));

            else{
                var Membresias=memberships.Membresias

                var Membresia ={}

                if(Membresias.length == 0){



                    Membresia ={
                        description:description,
                        fechaCompra:Date.now(),
                        fechaExpiracion:Date.now()+1000*60*60*24*30
                    }
                }else{
                    const fechaExpiracion=Membresias[Membresias.length-1].fechaExpiracion

                    if(fechaExpiracion < Date.now()){

                        Membresia ={
                            description:description,
                            fechaCompra:Date.now(),
                            fechaExpiracion:Date.now()+1000*60*60*24*30
                        }
                    }else{

                        Membresia ={
                            description:description,
                            fechaCompra:Date.now(),
                            fechaExpiracion:new Date(fechaExpiracion.getTime()+1000*60*60*24*30)
                        }
                    }
                }

                User.findByIdAndUpdate(user, {$push: {Membresias: Membresia}}, function (err) {
                    if (err) {
                        // Devolvemos el código HTTP 404, de usuario no encontrado por su id.
                        res.status(203).json({
                            status: "error",
                            data: "No se ha encontrado el usuario con id: " + id
                        });
                    } else {
                        // Devolvemos el código HTTP 200.
                        res.status(200).json({status: "ok", mensaje: "Pago Exitoso"});

                    }
                });
            }
        })

        //return res.status(200).json({ mensaje: "Pago Exitoso" });

    } catch (error) {
        console.log("error payment")
        console.log(error);
        return res.json({ mensaje: error.raw.message });
    }

}

ControllerMemberships.obtenerPagos =(req,res)=> {
    const id=req.decoded.sub

    User.findById(id, {"Membresias":1 ,"_id":0},async function  (err, memberships) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));


        res.status(200).json({ status: "ok", data: memberships.Membresias});

    })

}

ControllerMemberships.obtenerBeneficios = (req,res)=>{
    const id=req.decoded.sub

    User.findById(id, {"Membresias":1 ,"_id":0},async function  (err, memberships) {
        if (err)
            // Si se ha producido un error, salimos de la función devolviendo  código http 422 (Unprocessable Entity).
            return (res.type('json').status(203).send({ status: "error", data: "No se puede procesar la entidad, datos incorrectos!" }));

        else{
            const hoy=Date.now()

            if(memberships.length >0 ) {

                if (memberships[memberships.length - 1].fechaExpiracion >= hoy) {

                    const tipo = memberships[memberships.length - 1].description

                    var beneficios={}

                    if(tipo=="gold"){
                        beneficios={
                            workers:20,
                            anunces:10000,
                            analitics:true,
                            views:true,
                            support:true
                        }
                    }else if(tipo=="silver"){
                        beneficios={
                            workers:50,
                            anunces:20,
                            analitics:true,
                            views:false,
                            support:true
                        }

                    }else if(tipo=="bronze"){
                        beneficios={
                            workers:2,
                            anunces:10,
                            analitics:false,
                            views:false,
                            support:true
                        }
                    }

                    res.status(200).json({status: "ok", data: tipo, beneficios:beneficios});

                }else{
                    res.status(200).json({status: "ok", data: "Tu membresia Está Vencida, Renuevala Ahora para No perder tus beneficios"});
                }

            }else{
                res.status(200).json({status: "ok", data: "No has comprado ninguna mebresia"});
            }
        }


    })
}

module.exports=ControllerMemberships