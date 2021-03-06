// supertest - a SuperAgent driven library for testing HTTP Servers
const request = require('supertest');

// using nodejs's built-in assert
const assert = require('assert');
const schemas = require('./schemadefinitions.js');

// module for making authenticated calls
// .set('Authorization', 'Bearer ' + getToken())
require('../stormpathclient.js');

describe('Running user tests\n', function() {
    this.timeout(10000);
    
    // we need to create a new connection/instance 
    // and close the previous instance
    // of our server before each test so 
    // we know that previous requests had 
    // no effect on the current test
    // otherwise we introduce the 
    // possibility of calling methods
    // in a specific order as a 
    // condition as to whether something
    // fails or passes.
    var server;
    
    // each call to require caches the object and path internally
    // in nodejs, so when we close the server object nodejs 
    // this server object doesn't get recreated because 
    // node already keeps track of the first creation of it
    // therefore we need to force delete it from node's cache.
    // so we can re-instantiate server.

    beforeEach( function () {
        delete require.cache[require.resolve('../app')];
        server = require('../app');
    });

    // to properly close
    // expressjs server 
    // we need to wait for 
    // all connections to close
    // and only then let the mocha
    // test runtime know that it can
    // continue, even if we 
    // introduce a timeout the server
    // is NOT closed - we need to pass
    // mocha's done callback to close

    afterEach( function (done) {
            server.close(done);
    });

    it('Test GET all users from /apiauth/users', function testPath(done) {
        request(server)
        .get('/apiauth/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, (err, res) => {
            if (err) return done(err);
            
            var cnt = 0;
            res.body.forEach(function(elem) {
                // schemas.userSchema.forEach(function(field) {
                //     assert.notEqual(elem[field], undefined, 'Undefined field: ' + field);
                // });
                // schemas.locationSchema.forEach(function(field) {
                //     var loc = elem['location'];
                //     assert.notEqual(loc[field], undefined, 'Undefined field: location. ' + field);
                // });
                cnt++;
            });

            assert.notEqual(cnt, 0);

            done();
        });
    });

    it('Test schema of a well defined user', function testPath(done) {
        request(server)
        .get('/apiauth/users/getUserById/58eab79d7f43a719c8c0eab9')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, (err, res) => {
            if (err) return done(err);

            var user = res.body;
            schemas.userSchema.forEach(function(field) {
                assert.notEqual(user[field], undefined, 'Undefined field: ' + field);
            });

        done();    
     });
        
    });

    //skipping creating a new user for now
    it('Test POST to /apiauth/users', function test(done) {
        request(server)
        .post('/apiauth/users')
        .set('Authorization', 'Bearer ' + getToken())
        .send({
            isTest: true,
            name: 'TestUserName',
            email: 'testtest@gmail.com',
            age: '100',
            location: {
                coordinates: [10,10],
                type: 'Point'
            }
        })
        .end(done);
    });

    it('Test GET /apiauth/getUserByEmail/:email returns user by email', function test(done) {
        request(server)
        .get('/apiauth/users/getUserByEmail/fubnt@gmail.com')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, function (err, res) {
            if (err) return done(err);
            var user = res.body;
            var loc = user['location'];
            assert.equal(user['name'], 'FindUserByNameTest');
            assert.equal(user['email'], 'fubnt@gmail.com');
            assert.equal(user['age'], '100');
            assert.equal(loc['coordinates'][0], -87.603545);
            assert.equal(loc['coordinates'][1], 41.891667);
            assert.equal(loc['type'], 'Point');
            done();
        });
    });

    it('Test GET /apiauth/getUserByEmail/:email for non-existant user', function test(done) {
        request(server)
        .get('/apiauth/users/getUserByEmail/asdf@gmail.com')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, function (err, res) {
            if (err) return done(err);
            assert.equal(res.body, null);
            done();
        });
    });

    it('Test GET /apiauth/getUserById/:id returns user by id', function test(done) {
        request(server)
        .get('/apiauth/users/getUserById/589f949d50a58817f851b492')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, function (err, res) {
            if (err) return done(err);
            var user = res.body;
            var loc = user['location'];
            assert.equal(user['name'], 'FindUserByNameTest');
            assert.equal(user['email'], 'fubnt@gmail.com');
            assert.equal(user['age'], '100');
            assert.equal(loc['coordinates'][0], -87.603545);
            assert.equal(loc['coordinates'][1], 41.891667);
            assert.equal(loc['type'], 'Point');
            done();
        });
    });

    it('Test GET /apiauth/getUserById/:id returns user by id', function test(done) {
        request(server)
        .get('/apiauth/users/getUserById/asdf')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, function (err, res) {
            if (err) return done(err);
            assert.equal(res.body, null);
            done();
        });
    });

    it('Test GET /apiauth/findWithin/milesLonLat/1/166.674962/-77.842975', function test(done) {
        request(server)
        .get('/apiauth/users/findWithin/milesLonLat/1/166.674962/-77.842975')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, function (err, res) {
            if(err) return done(err);
            assert.equal(res.body.length, 1);
            done();   
        });
    });

    it('Test GET /apiauth/findWithin/milesLonLat/2/166.674962/-77.842975', function test(done) {
        request(server)
        .get('/apiauth/users/findWithin/milesLonLat/2/166.674962/-77.842975')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, function (err, res) {
            if(err) return done(err);
            assert.equal(res.body.length, 2);
            done();   
        });
    });

    it('Test GET /apiauth/findWithin/milesLonLat/4/166.765827/-77.807675', function test(done) {
        request(server)
        .get('/apiauth/users/findWithin/milesLonLat/4/166.765827/-77.807675')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, function (err, res) {
            if(err) return done(err);
            assert.equal(res.body.length, 3);
            done();   
        });
    });

    it('Test Get /apiauth/exportToKML', function test(done) {
        request(server)
        .get('/apiauth/users/exportToKML')
        .set('Authorization', 'Bearer ' + getToken())
        .expect('Content-Type', 'application/vnd.google-earth.kml+xml; charset=utf-8')
        .expect(200, function (err, res) {
            if(err) return done(err);
            done();
        });
    });

    it('Test POST to /apiauth/users/update', function test(done) {
        var d = new Date();
        var n = d.getTime();
        
        var newEmail = 'e' + n + '@mail.com';

        request(server)
        .post('/apiauth/users/update')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .send({
            isTest: true,
            user_id: "58c0bc9596f79e0686fe1bbc",
            name: 'TestUserName',
            email: newEmail,
            age: '100',
            location: {
                coordinates: [10,10],
                type: 'Point'
            },
            education: {
                school: "School",
                frield: "Field",
                degree: 1,
                year: 2000,
                inProgress: "true"}
            ,
            about: "about info",
            defaultLocation: {
                type: "Point",
                coordinates: [10, 10]
            },
            image_url: 'testurl',
            userMode: 'Student',
            about: 'aboutfieldfield',
            badfield: 'bad'
        })
        .expect(200)
        .end(done);
    });

    it('Test DELETE /apiauth/deleteByEmail/:email deletes user by email', function test(done) {
        request(server)
        .delete('/apiauth/users/deleteByEmail/testtest@gmail.com')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + getToken())
        .expect(200, function (err, res) {
            if (err) return done(err);
            done();
        });
    });
    // it('Test GET /deleteById/:id deletes a user by id', function test(done) {
    //     request(server)
    //     .post('/api/users')
    //     .send({
    //         _id: '589f98e894759b1d2eb00001',
    //         name: 'TestUserName',
    //         email: 'test@gmail.com',
    //         age: '100',
    //         location: {
    //             coordinates: [10,10],
    //             type: 'Point'
    //         }
    //     })
    //     .get('/api/users/deleteById/589f98e894759b1d2eb00001')
    //     .set('Accept', 'application/json')
    //     .expect(200, function (err, res) {
    //         if (err) return done(err);
    //         done();
    //     });
    // });
});
