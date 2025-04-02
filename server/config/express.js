'use strict';

const express = require('express');

const API = require('../api');

const app = express();

app.use(express.json());

// Router
app.use('/', API);

module.exports = app;
