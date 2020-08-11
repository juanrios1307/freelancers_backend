const  {Router} =require('express')
const route=Router()
const  controlUser=require('../controllers/controllerUsers')


route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://pacific-mesa-58371.herokuapp.com/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/:id?',controlUser.obtener)
route.post('/',controlUser.crear)
route.put('/id',controlUser.actualizar)
route.delete('/id',controlUser.eliminar)



module.exports =route
