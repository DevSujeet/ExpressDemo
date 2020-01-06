const Joi = require('joi'); //return a class //for validation
const express = require('express'); //returns a function //used for creating restfull services.
const helmet = require('helmet')    //third party middle ware
const morgan = require('morgan')    //third party middle ware

const config = require('config')
const startupDebugger = require('debug')('app:startup')    //app:startup is defining of a namesapce
const dbDebugger = require('debug')('app:db')   //returns a debugger function

const logger = require('./logger'); //export a function to be used a a middleware function
const authenticator = require('./authenticator');

const app = express(); //returns a object of type Express

//we need to set hte view engine of the app.
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
// we gonna put all our static assets like css, image in this folder

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

//custom middle ware
app.use(logger);
app.use(authenticator);
//NOTE:- middle ware functions are called in sequence. (word is pipeline.)
//-------------------- -------------------- -------------------- 

//-------------------- CONFIGURATION --------------------------------
startupDebugger('Application name = ' + config.get('name')) //name of the config property
startupDebugger('mail server = ' + config.get('mail.host'))
startupDebugger('mail password = ' + config.get('mail.password'))

//-------------------- -------------------- -------------------- 
// Declare local courses.
const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
    {id: 5, name: 'course5'}
]

app.get('/', (req,res) => {
    // res.send('welcome to sujeet courses');
    res.render('index', {title:'my express app', message:'hello there'} );
});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

//adding route as defined by restful services
'/api/courses/1'
app.get('/api/courses/:id', (req,res) => { //these(1 here) are also called URL params
    const idParam = req.params.id //is a string
    // res.send(param);

    //1. way to declare
    const matchedCourse = courses.find( (course) => {
        return course.id === parseInt(idParam);
    });
    //2. way to declare-- both works
    // const matchedCourse = courses.find( c => c.id === parseInt(idParam));

    if (!matchedCourse) { //404
        res.status(404).send(`course with id ${idParam} not found`)
        return
    }

    res.send(matchedCourse);
});

//route to add courses..
app.post('/api/courses', (req,res) => {
    //validation can be done using node package called "JOI"
    //define a schema
    const { error } = validateCourse(req.body); //object destructing-> equivalent to result.error

if (error) { //400 bad request
    res.status(400).send(error.message)
    return;
}
    //1--way
    // if (!req.body.name || req.body.name.length < 4) { //400 bad request
    //     res.status(400).send(`Course name missing or is too short`)
    //     return;
    // }

    const course = {
        id: courses.length + 1,
        name: req.body.name    //here assuming that name property would be present in body json.
    }

    courses.push(course);

    //by convention..send the created object in response
    res.send(course);
});

//PUT
app.put('/api/courses/:id', (req,res) => {
//1. ---------------------------------------------------
//look up for the course
//if not found = return 404
const idParam = req.params.id //is a string
    //1. way to declare
    const matchedCourse = courses.find( (course) => {
        return course.id === parseInt(idParam);
    });
    //2. way to declare-- both works
    // const matchedCourse = courses.find( c => c.id === parseInt(idParam));

    if (!matchedCourse) { //404
        return res.status(404).send(`course with id ${idParam} not found`)
    }
//2.---------------------------------------------------
//validate
//if validation failed, return 400 bad request

// const result = validateCourse(req.body);
const { error } = validateCourse(req.body); //object destructing-> equivalent to result.error

if (error) { //400 bad request
    return res.status(400).send(error.message)
    
}

//3.---------------------------------------------------
//update course
//return the update course
matchedCourse.name = req.body.name

res.send(matchedCourse)

});



//DELETE
app.delete('/api/courses/:id', (req,res) => {
    //1. ---------------------------------------------------
    //look up for the course
    //if not found = return 404
    const idParam = req.params.id //is a string
        //1. way to declare
        const matchedCourse = courses.find( (course) => {
            return course.id === parseInt(idParam);
        });
        //2. way to declare-- both works
        // const matchedCourse = courses.find( c => c.id === parseInt(idParam));
        if (!matchedCourse) { //404
            return res.status(404).send(`course with id ${idParam} not found`)
        }
    //2.---------------------------------------------------
    //DELETE
    const index = courses.indexOf(matchedCourse)
    courses.splice(index,1)
    
    //3.---------------------------------------------------
    //return the update course
    
    
    res.send(matchedCourse)
    
    });




function validateCourse(course) {
    //validation can be done using node package called "JOI"
    //define a schema
    const schema = {
        name: Joi.string().min(3).required()
    };

    let result = Joi.validate(course,schema);
    // console.log(result)

    return result
}





//can have multiple (url) params or route param
app.get('/api/courses/:year/:month', (req,res) => { //these(1 here) are also called URL params
    const yearParam = req.params.year
    const monthParam = req.params.month
    // res.send(`yearParam = ${yearParam} month = ${monthParam}`);
    // res.send(req.params)

    //Query stirng params sortBy=name
    //http://localhost:5000/api/courses/2019/12/?sortBy=name
    //query params are stored in an object with bunch of key-value pairs.
    res.send(req.query)
});



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