const  {Router} =require('express')
const route=Router()
const  controlMain=require('../controllers/controllerMain')


route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://pacific-mesa-58371.herokuapp.com/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/',controlMain.obtener)


module.exports =route
