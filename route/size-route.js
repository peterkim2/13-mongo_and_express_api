'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Size = require('../model/size.js');
const sizeRouter = module.exports = new Router();

sizeRouter.post('/api/size', jsonParser, function(req, res, next) {
  req.body.timestamp = new Date();
  new Size(req.body).save()
  .then( size => res.json(size))
  .catch(next);
});

sizeRouter.get('/api/size/:id', function(req, res, next) {
  Size.findById(req.params.id)
  .populate('dogs')
  .then( size => res.json(size))
  .catch( err => next(createError(404, err.message)));
});

sizeRouter.put('/api/size/:id', jsonParser, function(req, res, next) {
  Size.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( size => res.join(size))
  .catch(err => {
    if (err.name === 'ValidateError') return next(err);
    next(createError(404, err.message));
  });
});

sizeRouter.delete('/api/size/:id', function(req, res, next) {
  Size.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
