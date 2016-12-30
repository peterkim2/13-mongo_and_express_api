'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('size:size-router');

const Size = require('../model/size.js');
const sizeRouter = module.exports = new Router();

sizeRouter.post('/api/size', jsonParser, function(req, res, next) {
  debug('POST: /api/size');

  req.body.timestamp = new Date();
  new Size(req.body).save()
  .then( size => res.json(size))
  .catch(next);
});

sizeRouter.get('/api/size/:id', function(req, res, next) {
  debug('GET: /api/size');

  Size.findById(req.params.id)
  .populate('dogs')
  .then( size => res.json(size))
  .catch( err => next(createError(404, err.message)));
});

sizeRouter.put('/api/size/:id', jsonParser, function(req, res, next) {
  debug('PUT :/api/size');

  Size.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( size => res.json(size))
  .catch(err => {
    if (err.name === 'ValidateError') return next(err);
    next(createError(404, err.message));
  });
});

sizeRouter.delete('/api/size/:id', function(req, res, next) {
  debug('DELETE: /api/size');

  Size.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
