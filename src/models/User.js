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
    Workers:  [{type: Schema.Types.ObjectId, ref: 'workers' }],
    Anunces:  [{type: Schema.Types.ObjectId, ref: 'anunceWork' }],
    Chats:  [{type: Schema.Types.ObjectId, ref: 'chat' }],
    Membresias:[{
        description: {type: String, required: true},
        fechaCompra: {type: Date, default: Date.now},
        fechaExpiracion: {type: Date, required:true}
    }],
    WorkersBuscados : [{
        worker: {type: Schema.Types.ObjectId, ref: 'workers'},
        date: { type: Date, default: Date.now() }
    }]
})

// Exportamos el modelo para usarlo en otros ficheros
module.exports = User
