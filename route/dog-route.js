'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Dog = require('../model/dogs.js');
const debug = require('debug')('dog:dog-router');
const dogRouter = module.exports = new Router();
const createError = require('http-errors');

dogRouter.post('/api/dog', jsonParser, function(req, res, next) {
  debug('POST: /api/dog');

  req.body.timestamp = new Date();
  new Dog(req.body).save()
  .then( dog => res.json(dog))
  .catch(next);
});

dogRouter.get('/api/dog/:id', function(req, res, next) {
  debug('GET: /api/dog');

  Dog.findById(req.params.id)
  .then( dog => {
    if(dog === null) return Promise.reject(createError(404, 'not found'));
    res.json(dog);
  })
  .catch(next); //need to check if invalid characters. 
});

dogRouter.put('/api/dog/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/dog/');

  Dog.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( dog => res.json(dog))
  .catch(next);
});

dogRouter.delete('/api/dog/:id', function(req, res, next) {
  debug('DELETE: /api/dog');

  Dog.findByIdAndRemove(req.params.id)
  .then( () => res.sendStatus(204)) //if invalid id reject send 404
  .catch(next);
});
