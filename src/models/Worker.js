// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;

// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Worker = mongoose.model('workers',{
    profesion: {type:String ,required:true },
    yearsXperience: {type: Number ,required:true},
    experiencia : {type: String , required: true},
    imagen : {type: String },
    user: { type: Schema.ObjectId, ref: 'users' },
    promedio:{type:String, required:true},
    Comments:  [
        {user: {type: Schema.Types.ObjectId, ref: 'users'},
            comment: {type:String, required:true},
            rating:  {type:String, required:true},
            date: { type: Date, default: Date.now() }
            }]
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Worker
