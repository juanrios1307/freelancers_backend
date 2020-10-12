// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;

// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const User = mongoose.model('users',{
    correo: {type:String, required:true, unique:true},
    pwd:  {type:String, required:true},
    nombre: {type:String, required:true},
    telefono:  {type:String, required:true},
    ciudad: {type:String, required:true},
    isWorker: {type:Boolean},
    Save:  [{type: Schema.Types.ObjectId, ref: 'workers' }],
    Anunces:  [{type: Schema.Types.ObjectId, ref: 'anunceWork' }]
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = User
