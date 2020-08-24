const  {Router} =require('express')
const route=Router()
const controllerWorker=require('../controllers/controllerWorker')


route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/:id?',controllerWorker.obtener)
route.post('/',controllerWorker.crear)
route.put('/id',controllerWorker.actualizar)
route.delete('/id',controllerWorker.eliminar)

module.exports =route
