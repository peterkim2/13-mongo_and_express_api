'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Dog = require('../model/dogs.js');
const debug = require('debug')('dog:dog-router');
const dogRouter = module.exports = new Router();

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
  .then( dog => res.json(dog))
  .catch(next);
});
