const  {Router} =require('express')
const route=Router()
const  controllerAnunces=require('../controllers/controllerAnuncesWork')
const protectedRoutes=require('../helpers/protectedRoutes')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/:id?',protectedRoutes.verifyToken,controllerAnunces.obtener)
route.post('/',protectedRoutes.verifyToken,controllerAnunces.crear)
route.put('/:id',protectedRoutes.verifyToken,controllerAnunces.actualizar)
route.delete('/:id',protectedRoutes.verifyToken,controllerAnunces.eliminar)
route.put('/view/:id',protectedRoutes.verifyToken,controllerAnunces.views)


module.exports =route