'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dogSchema = Schema({
  name: {type: String, required: true},
  breed: {type: String, required: true},
  color: {type: String, required: true},
  sizeID: { type: Schema.Types.ObjectId, required: true }
});

module.exports =  mongoose.model('dog', dogSchema);
