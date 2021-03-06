const mongoose = require('mongoose');
const LocationSchema = require('./schemas/location.js');
const EducationSchema = require('./schemas/education.js');
const TutorSchema = require('./schemas/tutor.js');
const StudentSchema = require('./schemas/student.js');
// use for creating schemas for our models
const Schema = mongoose.Schema;

// explicitly telling mongo to not
// generate an _id field on our geoJSON objects
// with _id : {id: false}

// location - last known location
// defaultlocation - permanent (home location) location.
// fcm_tokens used for sending push messages through Google's FCM services - making this a collection to support multiple devices
// image_url used for profile photo

const UserSchema = new Schema({
    name: {type: String, required: true},
    age: {type: Number, required: false},
    email: {type: String, required: true},
    location: {type: LocationSchema, required: true}, // THIS NEEDS TO BE MIGRATED TO THE LOCATION COLLECTIONS
    education: {type: [EducationSchema], required: false},
    usergroups: [String], // For now each user is both a UserType.Student and UserType.Tutor
    image_url: {type: String, required: false},  // For user's profile image
    fcm_tokens: {type: [String], required: false},
    timekit_token : {type: String, required: false},  //used for timekit.io scheduling
    timekit_token_expiration : {type: Date, required: false}, //used to determine when timekit token expires
    timekit_calendar_id : {type: String, required: false},  // used for keeping track of bookings using a timekit.io calendar
    about: {type: String, required: false},
    creationdate: {type: Date, required: false},
    defaultlocation: {type: LocationSchema, required: false},
    userMode: String,    // Expects a UserType enum string either UserType.Student or UserType.Tutor
    student: {type: StudentSchema, required: false},
    tutor: {type: TutorSchema, required: false}
});

// Make sure this attribute has a spatial index
UserSchema.index({location: '2dsphere'});

module.exports = mongoose.model('User', UserSchema);
