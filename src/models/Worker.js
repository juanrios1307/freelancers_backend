// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;

// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Worker = mongoose.model('workers',{
    profesion: {type:String ,required:true },
    yearsXperience: {type: Number ,required:true},
    experiencia : {type: String , required: true},
    titulo :   {type: String},
    imagen : {type: String },
    user: { type: Schema.ObjectId, ref: 'users' }
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Worker
