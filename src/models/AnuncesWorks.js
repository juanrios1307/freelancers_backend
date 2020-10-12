// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const AnunceWork = mongoose.model('anunceWork',{
    user: { type: Schema.ObjectId, ref: 'users' },
    titulo: {type:String, required:true},
    profesion:  {type:String, required:true},
    presupuesto: {type:String, required:true},
    ciudad:  {type:String, required:true},
    especificaciones:  {type:String, required:true},
    imagen : {type: String }
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = AnunceWork
