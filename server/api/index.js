'use strict';

const { Router } = require('express');

const API = new Router();

API.get('/', (req, res) => {
    console.log('/ GET endpoint reached');
    res.send('Hello World!');
});

API.get('/status', (req, res) => {
    console.log('/status endpoint reached');
    res.status(200).json({ status: 'ok' });
});

API.get('/receipts/:receiptId/points', (req, res) => {
    console.log(`/receipts/receiptId/points GET endpoint reached`);
});

API.post('/receipts/process', (req, res) => {
    console.log(`/receipts/process POST endpoint reached`);
});

module.exports = API;