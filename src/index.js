const express=require('express')
const app=express()
const morgan=require('morgan')
const cors= require('cors')
const bodyparser=require('body-parser')
const errorHandler = require('./helpers/errorHandler');
const cookieParser = require('cookie-parser');


require('./helpers/database')

app.set('Port',5000)

app.use(morgan('dev'))
app.use(bodyparser.urlencoded({extend:true}))
app.use(bodyparser.json())
app.use(cors({origin:true}))


//Declaracion de rutas para manejo de api
app.use('/api/anunceswork',require('./routes/routerAnuncesWork'))
app.use('/api/chat',require('./routes/routerChat'))
app.use('/api/contact',require('./routes/routerContact'))
app.use('/api/users',require('./routes/routerCrudUser'))
app.use('/api/workers',require('./routes/routerCrudWorker'))
app.use('/api/filters',require('./routes/routerFilters'))
app.use('/api/login',require('./routes/routerLogin'))
app.use('/api/main',require('./routes/routerMain'))
app.use('/api/rate',require('./routes/routerRate'))
app.use('/api/saving',require('./routes/routerSavePublications'))
app.use('/api/updatepwd',require('./routes/routerUpdatePwd'))
app.use('/api/membership',require('./routes/routerMemberships'))

//start server
app.listen(process.env.PORT || 5000,()=>{
    console.log('Listen in the port ',process.env.PORT)
})

