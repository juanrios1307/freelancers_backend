// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const ContactMessage = mongoose.model('contactMessage',{
    correo: {type:String, required:true, unique:true},
    date:  {type:String, required:true},
    nombre: {type:String, required:true},
    mensaje:  {type:String, required:true},
    telefono:  {type:String, required:true, unique: false},
    idWorker: { type: Schema.ObjectId, ref: 'workers'}
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = ContactMessage