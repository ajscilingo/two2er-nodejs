const mongoose = require('mongoose');
const LocationSchema = require('./schemas/location.js');
const EducationSchema = require('./schemas/education.js');
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
    location: {type: LocationSchema, required: true},
    education: {type: [EducationSchema], required: false},
    usergroups: [String],
    image_url: String,
    fcm_tokens: [String], 
    admin: {type: Boolean, required: false},
    isstudent: {type: Boolean, required: false},
    istutor: {type: Boolean, required: false},
    about: {type: String, required: false},
    creationdate: {type: Date, required: false},
    defaultlocation: {type: LocationSchema, required: false}
});

// Make sure this attribute has a spatial index
UserSchema.index({location: '2dsphere'});

module.exports = mongoose.model('User', UserSchema);
