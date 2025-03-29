'use strict';

import express from 'express';

const app = express();

app.get('/', (req, res) => {
    console.log('/ GET endpoint reached');
    res.send('Hello World!');
});

app.get('/receipts/:receiptId/points', (req, res) => {
    const receiptId = req.body.receiptId;
    console.log(`/receipts/:receiptId/points GET endpoint reached`);
    console.log(receiptId);
});

app.post('/receipts/process', (req, res) => {
    console.log(`/receipts/process POST endpoint reached`);
});

console.log('Server running on port 3000...');
app.listen(3000);
