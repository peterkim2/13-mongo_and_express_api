'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Dog = require('../model/dogs.js');
const PORT = process.env.PORT || 8000;

require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleDog = {
  name: 'test dog name',
  breed: 'test dog breed',
  color: 'test dog color'
};

describe('Dog Routes', function() {
  describe('POST: api/dog', function() {
    describe('with a valid body', function() {
      after( done => {
        if(this.tempDog) {
          Dog.remove({})
          .then( () => done())
          .catch(done);
          return;
        }
        done();
      });
      it('should return a dog', => {
        request.post(`${url}/api/dog`)
        .send(exampleDog)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test dog name');
          expect(res.body.breed).to.equal('test dog breed');
          expect(res.body.color).to.equal('test dog color');
          this.tempDog = res.body;
          done();
        });
      });
    });
  });
  describe('GET: api/dog/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        exampleDog.timestamp = new Date();
        new Dog(exampleDog).save()
        .then( dog => {
          this.tempDog = dog;
          done();
        })
        .catch(done);
      });
      it('should return a dog', => {
        request.get(`${url}/api/dog/${this.tempDog._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test dog name');
          expect(res.body.breed).to.equal('test dog breed');
          expect(res.body.color).to.equal('test dog color');
          done();
        });
      });
    });
  });
});
