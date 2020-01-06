
//Note:- next is refrence to next function in the request processing pipeline.
function authenticator (req,res,next) {
    //supoose logging every request
    console.log('Authenticating...');

    //then pass controll to the next function in the pipeline. if not called this will leave request hanging.
    next();
}

module.exports = authenticator;