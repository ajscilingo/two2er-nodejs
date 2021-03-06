/**
 * 
 * This testing module is used to test our mongo database 
 * without explicitly connecting through our Express REST API
 * 
 */ 

// connect to our MongoDB through mongoose module
const mongoose = require('mongoose');
const User = require('../models/user.js');
const Student = require('../models/schemas/student.js').model;
const Tutor = require('../models/schemas/tutor.js').model;
const Booking = require('../models/booking.js');
// Enums used for Educational Degrees
const Degree = require('../enums/degree.js');
// Enums used for User UserType
const UserType = require('../enums/usertype.js');
// Enums used for BookingStatus
const BookingStatus = require('../enums/bookingstatus.js');
// using nodejs's built-in assert
const assert = require('assert');
// Connection String for our Two2er Mongodb Database
const url = 'mongodb://Admin:Password1@52.14.105.241:27017/Two2er';
// Used For creating Random Location Database
const geojsonRandom = require('geojson-random');
// change mongoose to use NodeJS global promises to supress promise deprication warning.
// https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

describe("MongoDB Booking Model Test", function () {

    // variables 

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

    // using multiple beforeEach for blocking syncronous calls
    // to creating tutor and student objects in sequential order

    beforeEach( function createTutor(done) {
        
        // create new User Document for Tutor
        var user = new User();
        assert.notEqual(user, undefined);
        
        user.age = 35;
        user.email = "MathTutor001@two2er.com";
        user.name = "Math Tutor 001";
        
        var randomLocation = geojsonRandom.position(BBOX_USA);
        user.location = {coordinates: [randomLocation[0], randomLocation[1]], type: 'Point'};
        
        // Education History
        user.education.push({school: "DePaul University", field: "Mathematics", degree: "BS", year: 2000, inProgress: false});

        // Add to Tutors User Group
        user.usergroups.push(UserType.Tutor.name);
        
        // create new tutor document associated with user document
        user.tutor = new Tutor();
        user.tutor.user_id = user._id;
        user.tutor.subjects = ["Algebra", "Calculus"];

        user.save( (err, user_product, numAffected) => {
            if(err)
                done(err);
            
            // assert that new document exists
            assert.notEqual(user_product, undefined);
            // assert only 1 document affected
            assert.equal(numAffected, 1);
           
            assert.notEqual(user_product.tutor, undefined);

            assert.equal(user_product.education.length, 1);
            assert.equal(Degree.enumValueOf(user_product.education[0].degree), Degree.BS);
            assert.equal(UserType.enumValueOf(user_product.usergroups[0]).isTutor(), true);
            // assert properties of document as specified 
            // above
            assert.equal(user_product.tutor.user_id, user._id);
            assert.equal(user_product.tutor.subjects[0], "Algebra");
            assert.equal(user_product.tutor.subjects[1], "Calculus");
            done();
           
        });
    });

    beforeEach( function createStudent(done) {
         
        // Create new instance of User for Student
        var user = new User();
        assert.notEqual(user, undefined);

        user.age = 19;
        user.email = "Student001@two2er.com";
        user.name = "Student Tutor 001";
        
        var randomLocation = geojsonRandom.position(BBOX_USA);
        user.location = {coordinates: [randomLocation[0], randomLocation[1]], type: 'Point'};

        // Education History
        user.education.push({school: "DePaul University", field: "Mathematics", degree: "BS", year: 2019, inProgress: true});

        // Add to Student User Group
        user.usergroups.push(UserType.Student.name);

        // create new Student document associated with user document
        user.student = new Student();
        assert.notEqual(user.student, undefined);

        user.student.courses.push("MAT 141");
        user.student.courses.push("MAT 160");

        user.save( (err, user_product, numAffected) => {
            if(err)
                done(err);
            
            // assert that new document exists
            assert.notEqual(user_product, undefined);
            // assert only 1 document affected
            assert.equal(numAffected, 1);
            
            // assert that new document exists
            assert.notEqual(user_product.student, undefined);

            // assert properties of document as specified 
            // above
            assert.equal(user_product.student.courses.length, 2);
            assert.equal(user_product.student.courses.includes("MAT 141"), true);
            assert.equal(user_product.student.courses.includes("MAT 160"), true);
            done();
        
        });
    });

    afterEach( function removeStudent(done){
        User.remove({email: "Student001@two2er.com"}, (err) => {
            if(err)
                done(err);
            else
                done();
        });
    });

    afterEach( function removeTutor(done){
        User.remove({email: "MathTutor001@two2er.com"}, (err) => {
            if(err)
                done(err);
            else
                done();
        });
    });

    it("Test Booking Student With Tutor", function createNewTutor(done) {
        //Find Tutor
        User.find({email: "MathTutor001@two2er.com"} , (err, users_tutors) => {
            if(err)
                done(err);
            // assert only 1 user with this email address exists
            assert.equal(users_tutors.length, 1);   
            // save tutor_user_id
            var tutor_user_id = users_tutors[0]._id;
            // maybe there should be a check that it's an ObjectID here ??
            
            // save tutor's name
            var tutor_name = users_tutors[0].name;
            
            // Find student
            User.find({email: "Student001@two2er.com"}, (err, users_students) => {
                if(err)
                    done(err);
                // assert only 1 user with this email address exists
                assert.equal(users_students.length, 1);
                // save student_user_id
                var student_user_id = users_students[0]._id;
                // maybe there should be a check that it's an ObjectID here ??

                var student_name = users_students[0].name;
                // assert student_user_id is not the same as tutor_user_id
                assert.equal(student_user_id != tutor_user_id, true);
                
                // create new booking
                var booking = new Booking();
                assert.notEqual(booking, undefined);

                // set student and tutor ids
                booking.student_user_id = student_user_id;
                booking.student_name = student_name;
                booking.tutor_user_id = tutor_user_id;
                booking.tutor_name = tutor_name;
                booking.bookingcreationdate = Date.now();
                booking.scheduledmeetingdate = new Date("June 4, 2017, 11:30:00");
                booking.status = BookingStatus.tentative.name;
                booking.save((err, booking_product, numAffected) => {
                    if(err)
                        done(err);
                    // assert that new document exists
                    assert.notEqual(booking_product, undefined);
                    // assert only 1 document affected
                    assert.equal(numAffected, 1);
                    // assert that booking has id
                    assert.notEqual(booking_product._id, undefined);
                    // assert student_user_id 
                    assert.equal(booking_product.student_user_id, student_user_id);
                    // assert tutor_user_id
                    assert.equal(booking_product.tutor_user_id, tutor_user_id);
                    // assert status requested
                    assert.equal(BookingStatus.enumValueOf(booking.status), BookingStatus.tentative);
                    done();
                });
            });
        });
    });

});