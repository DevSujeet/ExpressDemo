
//Note:- next is refrence to next function in the request processing pipeline.
function log(req,res,next) {
    //supoose logging every request
    console.log('Logging...');

    //then pass controll to the next function in the pipeline. if not called this will leave request hanging.
    next();
}

module.exports = log;

//Earlier in index.js below line app.use(express.json()); 

//adding a custom middleware ... Note:- next is refrence to next function in the request processing pipeline.
// app.use(function(req,res,next) {
//     //supoose logging every request
//     console.log('Logging...');

//     //then pass controll to the next function in the pipeline. if not called this will leave request hanging.
//     next();
// });