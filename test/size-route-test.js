'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Size = require('../model/size.js');
const PORT = process.env.PORT || 8000;

require('../server.js');

const url = `http://localhost:${PORT}`;

const exampleSize = {
  name: 'test size',
  timestamp: new Date()
};

const exampleDog = {
  name: 'test name',
  breed: 'test breed',
  color: 'test color'
};

describe('Size Routes', function() {
  describe('POST: /api/size', function() {
    describe('with a valid body', function() {
      after( done => {
        if(this.tempSize) {
          Size.remove({})
          .then( () => done())
          .catch(done);
          return;
        };
        done();
      });
      it('should return a size', done => {
        request.post(`${url}/api/size`)
        .send(exampleSize)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test size');
          this.tempSize = res.body;
          done();
        });
      });
    });
  });
  describe('GET: /api/size/:id', function() {
    describe('with a valid body', function() {
      before( done => {
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
        if(this.tempSize) {
          Size.remove({})
          .then( () => done())
          .catch(done);
          return;
        };
        done();
      });
      it('should return a size', done => {
        request.get(`${url}/api/size/${this.tempSize._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test size');
          expect(res.body.dogs.length).to.equal(1);
          expect(res.body.dogs[0].name).to.equal(exampleDog.name);
          done();
        });
      });
    });
  });
  describe('PUT: /api/size/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Size(exampleSize).save()
        .then( size => {
          this.tempSize = size;
          done();
        })
        .catch(done);
      });
      after( done => {
        if(this.tempSize) {
          Size.remove({})
          .then( () => done())
          .catch(done);
          return;
        };
        done();
      });
      it('should return a size', done => {
        var updated = {name: 'updated name'};
        request.put(`${url}/api/size/${this.tempSize._id}`)
        .send(updated)
        .end((err, res) => {
          if(err) return done(err);
          let timestamp = new Date(res.body.timestamp);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('updated name');
          expect(timestamp.toString()).to.equal(exampleSize.timestamp.toString());
          done();
        });
      });
    });
  });
  describe('DELETE: /api/size/:id', function() {
    describe('with a valid body', function() {
      before( done => {
        new Size(exampleSize).save()
        .then( size => {
          this.tempSize = size;
          done();
        })
        .catch(done);
      });
      after( done => {
        if(this.tempSize) {
          Size.remove({})
          .then(() => done())
          .catch(done);
          return;
        };
        done();
      });
      it('should delete size', done => {
        request.delete(`${url}/api/size/${this.tempSize._id}`)
        .end((err, res) => {
          if(err) return done();
          expect(res.status).to.equal(204);
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
  });
});
