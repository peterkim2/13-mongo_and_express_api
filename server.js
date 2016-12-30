'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('dog:server');
const errors = require('./lib/error-middleware.js');

const dogRouter = require('./route/dog-route.js');
const sizeRouter = require('./route/size-route.js');

const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = 'mongodb://localhost/dog';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(dogRouter);
app.use(sizeRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`Server up: ${PORT}`);
});
