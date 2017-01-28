
// connect to our MongoDB through mongoose module
const mongoose = require('mongoose');

// // Connection String for our Two2er Mongodb Database
const url = 'mongodb://Admin:Password1@52.14.105.241:27017/Two2er';

// Connect to MongoDB through mongoose
mongoose.connect(url);

// express module is needed for running as an http server
const express = require('express');

// bodyparse is needed for letting us get data from post
const bodyParser = require('body-parser');

const User = require('./user.js');
const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// listen on port 8080 unless otherwise specified
var port = process.env.PORT || 8080; 

//Route our APIs
var router = express.Router();  //get an instance of the express Router

// middleware for all our requests
router.use( (req, res, next) => {

    // do some logging 
    console.log('Something is happening');
    next(); // make sure we go to the next route and not stop here
});

router.get('/', (req, res) => {
    res.json({message: 'Two2er API'});
});

router.route('/users')

// add a new user (accessed via post http://localhost:8080/api/users)
.post ( (req, res) => {

    var user = new User();
    user.Name = req.body.Name;
    user.Age = req.body.Age;
    user.Location = req.body.Location;

    user.save( (err) => {
        if(err) 
            req.send(err);
        
        res.json({message: 'User created!'});
    });

})

// get all the users (accessed via GET http://localhost:8080/api/users)
.get( (req, res) => {

    User.find( (err, users) => {
        if(err) 
            res.send(err);
        
        res.json(users);
    })

});

router.route('/users/:user_name')

// get user with name like user_name (accessed via GET http://localhost:8080/api/users/<username>)
.get( (req,res) => {
    User.findOne({ Name: req.params.user_name}, (err, user) => {
        if(err) 
            res.send(err);
        res.json({message: user});
    });
});

app.use('/api', router);

app.listen(port);
console.log('Listening on port ' + port);

