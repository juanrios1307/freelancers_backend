const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51IKU2KGfY2o0HPMw3tWMGq79tTArmxJQUwhp0eXFjKtg3z37EA7EoyXv5e5k0yVsGVQhUTRNQNJ4J5RXm4zqCaYj007dcPEafm");
const ControllerMemberships={}

ControllerMemberships.crearPago =async (req,res)=>{

    const { id, amount } = req.body;
    console.log("id: "+id)
    try {
        console.log("try payment")
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "USD",
            description: "Gaming Keyboard",
            payment_method: id,
            confirm: true, //confirm the payment at the same time
        });

        return res.status(200).json({ mensaje: "Pago Exitoso" });
    } catch (error) {
        console.log("error payment")
        console.log(error);
        return res.json({ mensaje: error.raw.message });
    }

}

module.exports=ControllerMemberships