// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Worker = mongoose.model('workers',{
    userID: {type:String, required:true},
    profesion: {type:String ,required:true },
    yearsXperience: {type: Number ,required:true},
    experiencia : {type: String , required: true},
    titulo :  { data: Buffer, contentType: String },
    imagen : { data: Buffer, contentType: String }
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Worker
