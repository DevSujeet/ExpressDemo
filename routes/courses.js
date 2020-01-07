
const Joi = require('joi'); //return a class //for validation
//express.Router
//Use the express.Router class to create modular, mountable route handlers.
// A Router instance is a complete middleware and routing system; thats we use -- app.use('/api/courses',courses) in index.js
// for this reason, it is often referred to as a “mini-app”.
const express = require('express')
var router = express.Router()


// Declare local courses.
const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
    {id: 4, name: 'course4'},
    {id: 5, name: 'course5'}
]
//earlier before router - /api/courses
router.get('/', (req,res) => {
    res.send(courses);
});

//adding route as defined by restful services
'/api/courses/1'
router.get('/:id', (req,res) => { //these(1 here) are also called URL params
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
router.post('/', (req,res) => {
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
router.put('/:id', (req,res) => {
//1. ---------------------------------------------------
//look up for the course
//if not found = return 404
const idParam = req.params.id //is a string
console.log('put param ' + idParam)
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
router.delete('/:id', (req,res) => {
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
router.get('/:year/:month', (req,res) => { //these(1 here) are also called URL params
    const yearParam = req.params.year
    const monthParam = req.params.month
    // res.send(`yearParam = ${yearParam} month = ${monthParam}`);
    // res.send(req.params)

    //Query stirng params sortBy=name
    //http://localhost:5000/api/courses/2019/12/?sortBy=name
    //query params are stored in an object with bunch of key-value pairs.
    res.send(req.query)
});

module.exports = router
