'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json())

const receiptsMap = new Map();

app.get('/', (req, res) => {
    console.log('/ GET endpoint reached');
    res.send('Hello World!');
});

app.get('/receipts/:receiptId/points', (req, res) => {
    const receiptId = req.params.receiptId;
    console.log(`/receipts/:receiptId/points GET endpoint reached`);
    console.log(receiptId);

    const receiptDoc = receiptsMap.get(receiptId);
    if (receiptDoc) {
        console.log('Receipt found, receiptDoc: ', receiptDoc);
        return res.status(200).json({ "points": receiptDoc.points });
    } else {
        console.warn(`Receipt not found for receiptId ${receiptId}`)
        return res.status(404).send('No receipts found.');
    }
});

app.post('/receipts/process', (req, res) => {
    console.log(`/receipts/process POST endpoint reached`);
    const receiptId = uuidv4();
    const receiptBody = req.body;
    const receiptPoint = calculateReceiptPoints(receiptBody);
    const receiptDoc = {receiptId, "points": receiptPoint, receiptBody};

    console.log('receiptDoc: ', receiptDoc);

    receiptsMap.set(receiptId, receiptDoc);
    return res.json(receiptDoc);
});

console.log('Server running on port 3000...');
app.listen(3000);

function calculateReceiptPoints(receiptBody) {
    console.log('calculateReceiptPoints');
    let totalPoints = 0;

    totalPoints += calculateRetailerNamePoints(receiptBody);
    totalPoints += calculateRetailerItemsTotalPoints(receiptBody);

    return totalPoints;
};

function calculateRetailerNamePoints(receiptBody) {
    console.log('calculateReceiptPoints');
    return receiptBody.retailer.length
}

function calculateRetailerItemsTotalPoints(receiptBody) {
    console.log('calculateRetailerItemsTotalPoints');
    let itemsTotalPoints = 0;
    if (isRoundDollarAmount(receiptBody.total)) {
        itemsTotalPoints = 50;
    } else if (isMultipleOfQuarter(receiptBody.total)) {
        itemsTotalPoints = 25;
    }

    return itemsTotalPoints;
}

function isRoundDollarAmount(totalPointsNumber) {
    return !((totalPointsNumber - Math.floor(totalPointsNumber)) !== 0);
}

function isMultipleOfQuarter(totalPointsNumber) {
    const tolerance = 0.0001; // Define a small tolerance
    const remainder = totalPointsNumber % 0.25;
    return remainder <= tolerance || Math.abs(remainder - 0.25) <= tolerance;
}