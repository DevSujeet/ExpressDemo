
const express = require('express'); //returns a function //used for creating restfull services.
const helmet = require('helmet')    //third party middle ware
const morgan = require('morgan')    //third party middle ware

const config = require('config')
const startupDebugger = require('debug')('app:startup')    //app:startup is defining of a namesapce
const dbDebugger = require('debug')('app:db')   //returns a debugger function

const logger = require('./middleware/logger'); //export a function to be used a a middleware function
const authenticator = require('./middleware/authenticator');

//routers for endpoints
const courses = require('./routes/courses')
const home = require('./routes/homepage')

const app = express(); //returns a object of type Express

//we need to set the view engine of the app.
app.set('view engine', 'pug')  //app.set(‘nameOfTheProperty’, ’templating engine THAT IS PUG ’), so when we set this, express will load this..no need to require
app.set('views', './views')

//-------------------- MIDDLEWARE --------------------------------
//App.use() is to install a middleware or middleware function in request processing pipeline
app.use(express.json());    //to enable json parsing of body, bydefault parsing is not enabled.

app.use(express.urlencoded({extended: true})); //parses incoming request with url encoded payloads
//in request key=value&key=value. in postman we pass using x-www-form-urlencoded
//this middle ware will convert this to "req.body" json by read the prop in url encoded.
//http://localhost:5000/api/courses/name=course5 //eg of url-encoded
//http://localhost:5000/api/courses/2019/12/?sortBy=name 2019 12 are url param, sortBy is the query param



app.use(express.static('public'));  //to serve static files from a given folder..'public' is the name of the folder,
// we gonna put all our static assets like css, image in this folder //eg:-http://localhost:3000/readme.txt

//Third party middle ware ..these require- install and require
//like:- npm install helmet --save/&/const helmet = require('helmet') 
//Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet()) 

// console.log(`NODE_ENV = ${process.env.NODE_ENV}`)   //undefined if not defined
// console.log(`app env = ${app.get('env')}`)    //default to development if undefined..internally uses above
if (app.get('env') === 'development') {
    app.use(morgan('tiny')) //to log http request.
    // console.log("morgan enabled")
    startupDebugger("morgan enabled")
}

dbDebugger('connected to databse')

//custom middleware
app.use(logger);
app.use(authenticator);
//NOTE:- middle ware functions are called in sequence. (word is pipeline.)
//-------------------- -------------------- -------------------- 

//-------------------- CONFIGURATION --------------------------------
startupDebugger('Application name = ' + config.get('name')) //name of the config property
startupDebugger('mail server = ' + config.get('mail.host'))
startupDebugger('mail password = ' + config.get('mail.password'))   //remeber to export the secret in terminal// export app_password=1234

//-------------------- -------------------- -------------------- 


// app.get('/', (req,res) => {
//     // res.send('welcome to sujeet courses');
//     res.render('index', {title:'my express app', message:'hello there'} );
// }); //home

//routing to differnent API end pint
app.use('/',home)
//all the endpint starting with  /api/courses will be directed to course route.
app.use('/api/courses',courses)

//assign a static port number is ok when developing in local.
// but in production env, port are assigned dynamically by the hosting enviorment.
//way to fix this is by using enviroment variable.

//typically in hosting env, we have env variable called "PORT"
//An enviorment variable is basically a variable that is part of the enviroment in which process run
///its value is set outside this application.
//on MAC you can set env variable PORT using export command.
//export PORT=5000
const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`listening on port ${port}...`);
});