// supertest - a SuperAgent driven library for testing HTTP Servers
const request = require('supertest');

// using nodejs's built-in assert
const assert = require('assert');

const schemas = require('./schemadefinitions.js');

// module for making authenticated calls
// .set('Authorization', 'Bearer ' + getToken())
require('../stormpathclient.js');

describe('Running user locations tests\n', function() {
    this.timeout(10000);
    var server;
    
    beforeEach( function () {
        delete require.cache[require.resolve('../app')];
        server = require('../app');
    });

    afterEach( function (done) {
            server.close(done);
    });

    /*it('Test GET all student locations from /api/studentlocations', function (done) {
        request(server)
        .get('/api/studentlocations')
        .set('Accept', 'application/json')
        .expect(200, (err, res) => {
            if (err) return done(err);
            
            var cnt = 0;
            res.body.forEach(function(elem) {
                schemas.userLocationSchema.forEach(function(field) {
                    assert.notEqual(elem[field], undefined, 'Undefined field: ' + field);
                });

                var loc = elem['location'];
                schemas.locationSchema.forEach(function(field) {
                    assert.notEqual(elem[field], undefined, 'Undefined location field: ' + field);
                });
                cnt++;
            });

            assert.notEqual(cnt, 0);

            done();
        });
    });*/

    it('Test GET all student locations from /apiauth/studentlocations', function (done) {
        request(server)
        .get('/apiauth/studentlocations')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, (err, res) => {
            if (err) return done(err);
            
            var cnt = 0;
            res.body.forEach(function(elem) {
                schemas.userLocationSchema.forEach(function(field) {
                    assert.notEqual(elem[field], undefined, 'Undefined field: ' + field);
                });

                var loc = elem['location'];
                schemas.locationSchema.forEach(function(field) {
                    assert.notEqual(elem[field], undefined, 'Undefined location field: ' + field);
                });
                cnt++;
            });

            assert.notEqual(cnt, 0);

            done();
        });
    });

    /*it('Test GET all tutor locations from /api/tutorlocations', function (done) {
        request(server)
        .get('/api/tutorlocations')
        .set('Accept', 'application/json')
        .expect(200, (err, res) => {
            if (err) return done(err);
            
            var cnt = 0;
            res.body.forEach(function(elem) {
                schemas.userLocationSchema.forEach(function(field) {
                    assert.notEqual(elem[field], undefined, 'Undefined field: ' + field);
                });

                var loc = elem['location'];
                schemas.locationSchema.forEach(function(field) {
                    assert.notEqual(elem[field], undefined, 'Undefined location field: ' + field);
                });
                cnt++;
            });

            assert.notEqual(cnt, 0);

            done();
        });
    });*/

    it('Test GET all tutor locations from /apiauth/tutorlocations', function (done) {
        request(server)
        .get('/apiauth/tutorlocations')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, (err, res) => {
            if (err) return done(err);
            
            var cnt = 0;
            res.body.forEach(function(elem) {
                schemas.userLocationSchema.forEach(function(field) {
                    assert.notEqual(elem[field], undefined, 'Undefined field: ' + field);
                });

                var loc = elem['location'];
                schemas.locationSchema.forEach(function(field) {
                    assert.notEqual(elem[field], undefined, 'Undefined location field: ' + field);
                });
                cnt++;
            });

            assert.notEqual(cnt, 0);

            done();
        });
    });

});