const ControllerContact={}
const Message=require('../models/ContactMessage')

ControllerContact.obtener= (req,res) =>{
    //Se busca el trabajador requerido
    Message.findById(req.params.id, function (err, user) {
        if (err) {
            // Devolvemos el código HTTP 404, de producto no encontrado por su id.
            res.status(404).json({ status: "error", data: "No se ha encontrado el usuario con id: "+req.params.id});
        } else {
            // También podemos devolver así la información:
                es.status(200).json({ status: "ok", data: user });
        }
    })
}

ControllerContact.crear= async (req,res)=>{

    //Caso usuario no autenticado

    //Se recibe el id del trabajador buscado
    const idWorker=req.params.id

    //Se reciben los datos a enviar
    const {correo,date,nombre,mensaje,telefono} =req.body //atributos

    //se registran los datos en el modelo y se suben a la DB
    const registro=new Message({
        correo,
        date,
        nombre,
        mensaje,
        telefono,
        idWorker
    })
    await  registro.save()


    //Se genera respuesta de exito
    res.json({
        mensaje:"Registro guardado"
    })


}

//Se exporta el controlador
module.exports=ControllerContact