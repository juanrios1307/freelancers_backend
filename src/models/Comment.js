// Cargamos el módulo de mongoose
const mongoose =  require('mongoose');
var Schema=mongoose.Schema;
// Usaremos los esquemas

// Creamos el objeto del esquema y sus atributos
const Comment = mongoose.model('comments',{
    user: { type: Schema.ObjectId, ref: 'users' },
    worker: { type: Schema.ObjectId, ref: 'workers' },
    comment: {type:String, required:true},
    rating:  {type:String, required:true},
    fecha: {type:String, required:true}
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = Comment
