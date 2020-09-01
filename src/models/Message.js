// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Message = mongoose.model('Message',{
    user: { type: Schema.ObjectId, ref: 'users' },
    worker: { type: Schema.ObjectId, ref: 'workers' },
    mensaje:  {type:String, required:true},
    fecha: {type:String, required:true},
    direccion:  {type:String, required:true}
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Message
