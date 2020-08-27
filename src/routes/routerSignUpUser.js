const  {Router} =require('express')
const route=Router()
const  controlUser=require('../controllers/controllerSignUpUsers')


route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/:id?',controlUser.obtener)
route.post('/',controlUser.crear)
route.put('/id',controlUser.actualizar)
route.delete('/id',controlUser.eliminar)



module.exports =route
