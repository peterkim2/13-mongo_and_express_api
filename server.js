'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const dogRouter = require('./route/dog-router.js');
const debug = require('debug')('dog:server');

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = 'mongodb://localhost/dog';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
// app.use(dogRouter);

app.listen(PORT, () => {
  debug('Server up:', PORT);
});
