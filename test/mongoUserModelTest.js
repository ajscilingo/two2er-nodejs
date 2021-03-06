/**
 * 
 * This testing module is used to test our mongo database 
 * without explicitly connecting through our Express REST API
 * 
 */

// connect to our MongoDB through mongoose module
const mongoose = require('mongoose');
// using nodejs's built-in assert
const assert = require('assert');
// Mongoose User Model
const User = require('../models/user.js');

// Connection String for our Two2er Mongodb Database
const url = 'mongodb://Admin:Password1@52.14.105.241:27017/Two2er';
// Used For creating Random Location Database
const geojsonRandom = require('geojson-random');

// Enums used for Educational Degrees
const Degree = require('../enums/degree.js');
// Enums used for User UserType
const UserType = require('../enums/usertype.js');

// change mongoose to use NodeJS global promises to supress promise deprication warning.
// https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

describe("MongoDB User Model Test", function () {

    // Mocha Context Timeout
    this.timeout(10000);

    before(function connectionState(done) {
        
        // assert that we aren't connected to the database
        assert.equal(mongoose.connection.readyState, 0);

        // connect to the database 
        mongoose.connect(url, {
            server : {
                socketOptions : {
                        socketTimeoutMS: 0,
                        connectTimeoutMS: 30000
                }
            }
        }, (err) => {
        
            if(err)
                done(err);
            else{
                done();
            }
        });
    });

     after(function (done) {
        
        // assert that connection is still open
        assert.equal(mongoose.connection.readyState, 1);

        // disconnect from database
        mongoose.disconnect(function (error) {
            if(error) 
                done(error);
            else
                done();
        });

    });

    it("users collection exists", function userCollectionExists(done){

        mongoose.connection.db.listCollections({name: 'users'})
        .next( (err, collinfo) => {
            if(err) 
                done(err);
            else{
                if(collinfo)
                    done();
            }
        });

    });

    it("Create New User Document - Minimal Attirbutes", function createNewUser(done) {
        
        // create new instance of User Model
        var user = new User();
        assert.notEqual(user, undefined);
        
        user.age = 25;
        user.email = "testUser1234@two2er.com";
        user.name = "Test User 1234";
        user.location = {coordinates: [-87.6863, 41.945314], type: 'Point'};
        user.usergroups.push("Student");

        user.save( (err, product, numAffected) => {
            if(err)
                done(err);
            // assert that new document exists
            assert.notEqual(product, undefined);
            // assert only 1 document affected
            assert.equal(numAffected, 1);
            // assert properties of document as specified 
            // above
            assert.equal(product.age, 25);
            assert.equal(product.email, "testUser1234@two2er.com");
            assert.equal(product.name, "Test User 1234");
            assert.equal(product.location.type, "Point");
            assert.equal(product.location.coordinates[0], -87.6863);
            assert.equal(product.location.coordinates[1], 41.945314);
            assert.equal(UserType.enumValueOf(product.usergroups[0]).isStudent(), true);
            done();
        });
    });

    it("Search For User Document By Email", function searchForUser(done) {
        
        User.findOne({email : "testUser1234@two2er.com"}, (err, user) => {
            if(err)
                done(err);
            else{
                assert.notEqual(user, undefined);
                done();
            }
        });

    });

    it("Delete User Document By Email", function deleteUserByEmail(done) {
    
        User.remove({email : "testUser1234@two2er.com"}, (err) => {
            if(err) 
                done(err);
            else{
                done();
            }
        });
    });


    it("Create New User Document - Random Location Data", function createNewUserRandomLocation(done) { 
        
        // Create new instance of User Model
        var user = new User();
        assert.notEqual(user, undefined);

        user.age = 35;
        user.email = "testUser1111@two2er.com";
        user.name = "Test User 1111";
        
         // Random Location
        var randomLocation = geojsonRandom.position(BBOX_USA);
        user.location = {coordinates: [randomLocation[0], randomLocation[1]], type: 'Point'};

        // Random Default Location
        var defaultLocation = geojsonRandom.position(BBOX_USA);
        user.defaultlocation = {coordinates: [defaultLocation[0], defaultLocation[1]], type: 'Point'};

        user.save( (err, product, numAffected) => {
            if(err)
                done(err);
            // assert that new document exists
            assert.notEqual(product, undefined);
            // assert only 1 document affected
            assert.equal(numAffected, 1);
            // assert properties of document as specified 
            // above

            assert.equal(product.age, 35);
            assert.equal(product.email, "testUser1111@two2er.com");
            assert.equal(product.name, "Test User 1111");
            assert.equal(product.location.coordinates[0], randomLocation[0]);
            assert.equal(product.location.coordinates[1], randomLocation[1]);
            assert.equal(product.defaultlocation.coordinates[0], defaultLocation[0]);
            assert.equal(product.defaultlocation.coordinates[1], defaultLocation[1]);
            done();
        });

    });

    it("Delete User Document By Name", function deleteUserByEmail(done) {
    
        User.remove({name : "Test User 1111"}, (err) => {
            if(err) 
                done(err);
            else{
                done();
            }
        });
    });

    it("Geospatial Search - 1 Mile", function searchByLocation(done) {
    
    // search 1 mile in distance
    var distance = 1 * METERS_IN_MILES;

    var geoSpatialQuery = User.find({
        'location' : {
            $nearSphere : {
                $geometry : {
                    type: "Point",
                    coordinates : [ 166.674962, 
                                   -77.842975
                                ]
                },
                $maxDistance : distance
            }
        }   
    });

    geoSpatialQuery.exec( (err, users) => {
        if(err) 
            done(err);
        else{
            // assert that there is 1 user in this 1 mile search
            assert.equal(users.length, 1);
            done();
        }
    });

  });

  it("Geospatial Search - 2 Mile", function searchByLocation(done) {
    
    // search 2 miles in distance
    var distance = 2 * METERS_IN_MILES;

    var geoSpatialQuery = User.find({
        'location' : {
            $nearSphere : {
                $geometry : {
                    type: "Point",
                    coordinates : [ 166.674962, 
                                   -77.842975
                                ]
                },
                $maxDistance : distance
            }
        }   
    });

    geoSpatialQuery.exec( (err, users) => {
        if(err) 
            done(err);
        else{
            // assert that there are 2 users in this 2 mile search
            assert.equal(users.length, 2);
            done();
        }
    });

  });

  it("Geospatial Search - 4 Mile", function searchByLocation(done) {
    
    // search 4 miles in distance
    var distance = 4 * METERS_IN_MILES;

    var geoSpatialQuery = User.find({
        'location' : {
            $nearSphere : {
                $geometry : {
                    type: "Point",
                    coordinates : [ 166.674962, 
                                   -77.842975
                                ]
                },
                $maxDistance : distance
            }
        }   
    });

    geoSpatialQuery.exec( (err, users) => {
        if(err) 
            done(err);
        else{
            // assert that there are 3 users in this 4 mile search
            assert.equal(users.length, 3);
            done();
        }
    });

  });    

});