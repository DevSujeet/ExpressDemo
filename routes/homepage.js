
const express = require('express')
const app = express()
var router = express.Router()

app.set('view engine', 'pug')  //app.set(‘nameOfTheProperty’, ’templating engine THAT IS PUG ’), so when we set this, express will load this..no need to require
app.set('views', './views')

router.get('/', (req,res) => {
    // res.send('welcome to sujeet courses');
    res.render('index', {title:'my express app', message:'hello there'} );
});

module.exports = router