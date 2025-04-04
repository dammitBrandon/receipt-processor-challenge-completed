'use strict';

const { Router } = require('express');

const {processReceipt, getReceipt} = require('../services/receipt-service');

const API = new Router();

API.get('/status', (req, res) => {
    console.log('/status endpoint reached');
    res.status(200).json({ status: 'ok' });
});

API.get('/receipts/:receiptId/points', getReceipt);

API.post('/receipts/process', processReceipt);

module.exports = API;