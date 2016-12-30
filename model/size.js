'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('dog:size');
const Schema = mongoose.Schema;

const Dog = require('./dogs.js');

const sizeSchema = Schema ({
  name: { type: String, require: true},
  timestamp: { type: Date, required: true},
  dogs: [{ type: Schema.Types.ObjectId, ref: 'dog'}]
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

Size.findByIdAndRemoveDog = function(id) {
  debug('findByIdAndRemoveDog');

  return Dog.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then( dog => {
    this.tempDog = dog;
    return Dog.findByIdAndRemove(dog._id);
  })
  .then( () => Size.findById(this.tempDog.sizeID))
  .then( size => {
    size.dogs.splice(size.dogs.indexOf(this.tempDog._id), 1);
    this.tempSize = size;
    return this.tempSize;
  });
};
