const  {Router} =require('express')
const route=Router()
const  controlFilter=require('../controllers/controllerFilters')

route.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","https://glacial-everglades-42121.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","https://peaceful-ridge-86113.herokuapp.com/")
    res.header("Access-Control-Allow-Origin","http://localhost:3000/")
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    next()
});

route.get('/ciudades',controlFilter.obtenerCiudades)
route.get('/profesion',controlFilter.obtenerProfesion)
route.get('/promedio',controlFilter.obtenerPromedio)
route.get('/years',controlFilter.obtenerYearsExperience)

route.get('/ciudadesa',controlFilter.obtenerCiudadesAnunces)
route.get('/date',controlFilter.obtenerFecha)
route.get('/presupuesto',controlFilter.obtenerPresupuesto)

module.exports =route