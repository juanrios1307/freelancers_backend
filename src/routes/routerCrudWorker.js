const  {Router} =require('express')
const route=Router()
const controllerWorker=require('../controllers/controllerCrudWorker')
const protectedRoutes=require('../helpers/protectedRoutes')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/:id?',protectedRoutes.verifyToken,controllerWorker.obtener)
route.post('/',protectedRoutes.verifyToken,controllerWorker.crear)
route.put('/:id',protectedRoutes.verifyToken,controllerWorker.actualizar)
route.delete('/:id',protectedRoutes.verifyToken,controllerWorker.eliminar)
route.put('/view/:id',protectedRoutes.verifyToken,controllerWorker.views)

module.exports =route
