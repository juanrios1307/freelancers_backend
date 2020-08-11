const express=require('express')
const app=express()
const morgan=require('morgan')
const cors= require('cors')
const bodyparser=require('body-parser')

require('./databases/database')

app.set('Port',5000)

app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extend:true}))
app.use(bodyparser.json())

//Rutas
app.use(cors({origin:true}))
app.use('/api/signupuser',require('./routes/routerUser'))
app.use('/api/signupworker',require('./routes/routerWorker'))

//start server
app.listen( 5000,()=>{
    console.log('Listen in the port ',5000)

})

