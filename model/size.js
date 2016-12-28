'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('dog:list');
const Schema = mongoose.Schema;

const Dog = require('./dogs.js');

const sizeSchema = Schema ({
  name: { type: String, require: true},
  timestamp: { type: Date, required: true},
  notes: [{ type: Schema.Types.ObjectId, ref: 'dog'}]
});

const Size = module.exports =  mongoose.model('size', sizeSchema);

Size.findByIdAndAddDog = function(id, dog) {
  debug('findByIdAndAddDog');

  return Size.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then( size => {
    dog.sizeID = size._id;
    this.tempSize = size;
    return new Dog(dog).save();
  })
  .then( dog => {
    this.tempSize.dogs.push(dog._id);
    this.tempDog = dog;
    return this.tempSize.save();
  })
  .then( () => {
    return this.tempDog;
  });
};
