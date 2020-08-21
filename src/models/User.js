// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const User = mongoose.model('users',{
    correo: {type:String, required:true, unique:true},
    pwd:  {type:String, required:true},
    nombre: {type:String, required:true},
    apellido:  {type:String, required:true},
    telefono:  {type:String, required:true, unique: false},
    isWorker: {type:Boolean},

})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = User
