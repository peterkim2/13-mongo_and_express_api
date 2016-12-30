'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Dog = require('../model/dogs.js');
const Size = require('../model/size.js');
const PORT = process.env.PORT || 8000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleDog = {
  name: 'test dog name',
  breed: 'test dog breed',
  color: 'test dog color'
};

const exampleSize = {
  name: 'example size',
  timestamp: new Date()
};

describe('Dog Routes', function() {
  describe('POST: /api/size/:sizeID/dog', function() {
    describe('with a valid body', () => {
      before( done => {
        new Size(exampleSize).save()
        .then( size => {
          this.tempSize = size;
          done();
        })
        .catch(done);
      });
      after( done => {
        Promise.all([
          Size.remove({}),
          Dog.remove({})
        ])
        .then( () => done())
        .catch(done);
      });
      it('should return a dog', done => {
        request.post(`${url}/api/size/${this.tempSize._id}/dog`)
        .send(exampleDog)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleDog.name);
          expect(res.body.breed).to.equal(exampleDog.breed);
          expect(res.body.color).to.equal(exampleDog.color);
          expect(res.body.sizeID).to.equal(this.tempSize._id.toString());
          this.tempDog = res.body;
          done();
        });
      });
    });
  });
  describe('GET: api/dog/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        exampleSize.timestamp = new Date();
        new Size(exampleSize).save()
        .then( size => {
          this.tempSize = size;
          return Size.findByIdAndAddDog(size._id, exampleDog);
        })
        .then( dog => {
          this.tempDog = dog;
          done();
        })
        .catch(done);
      });
      after( done => {
        Promise.all([
          Size.remove({}),
          Dog.remove({})
        ])
        .then( () => done())
        .catch(done);
      });
      it('should return a dog', done => {
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
  describe('PUT: /api/dog:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Dog(exampleDog).save()
        .then( dog => {
          this.tempDog = dog;
          done();
        })
        .catch(done);
      });
      it('should update and return dog', done => {
        request.put(`${url}/api/dog/${this.tempDog._id}`)
        .send({name:'update name', breed:'update breed', color:'update color'})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('update name');
          expect(res.body.breed).to.equal('update breed');
          expect(res.body.color).to.equal('update color');
          done();
        });
      });
    });
  });
});
