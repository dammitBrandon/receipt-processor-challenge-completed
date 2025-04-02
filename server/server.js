'use strict';

const express = require('express');
const moment = require('moment');
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
    console.log(`/receipts/${receiptId}/points GET endpoint reached`);

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
    receiptsMap.set(receiptId, receiptDoc);

    return res.json(receiptDoc);
});

console.log('Server running on port 3000...');
app.listen(3000);

function calculateReceiptPoints(receiptBody) {
    console.log('calculateReceiptPoints');
    let totalPoints = 0;

    totalPoints += calculateRetailerNamePoints(receiptBody);
    totalPoints += calculateRetailerTotalPoints(receiptBody);
    totalPoints += calculateRetailerItemsPoints(receiptBody);
    totalPoints += calculateRetailerItemDescriptionPoints(receiptBody);
    totalPoints += calculateRetailerDateTimePoints(receiptBody);

    return totalPoints;
};

function calculateRetailerNamePoints(receiptBody) {
    console.log('calculateReceiptPoints');
    let nameTotalPoints = 0;
    const alphaNumericRegex = /[a-zA-Z0-9]/g;

    nameTotalPoints += receiptBody.retailer.match(alphaNumericRegex).length;

    return nameTotalPoints;
}

function calculateRetailerTotalPoints(receiptBody) {
    console.log('calculateRetailerTotalPoints');
    let itemsTotalPoints = 0;
    if (isRoundDollarAmount(receiptBody.total)) {
        itemsTotalPoints += 50;
    }

    if (isMultipleOfQuarter(receiptBody.total)) {
        itemsTotalPoints += 25;
    }

    return itemsTotalPoints;
}

function calculateRetailerItemsPoints(receiptBody) {
    console.log('calculateRetailerItemsPoints');
    let itemsTotalPoints = 0;
    let numberOfItems = receiptBody.items.length;
     if (numberOfItems % 2 === 0) {
         itemsTotalPoints = (numberOfItems / 2) * 5;
     } else {
         itemsTotalPoints = ((numberOfItems - 1) / 2) * 5;
     }

    return itemsTotalPoints;
}

function calculateRetailerItemDescriptionPoints(receiptBody) {
    console.log('calculateRetailerItemDescriptionPoints');
    let itemDescriptionPoints = 0;

    receiptBody.items.forEach((item) => {
        if (item.shortDescription.trim().length % 3 === 0) {
            let itemPricePoints = Math.ceil(item.price * 0.2);
            itemDescriptionPoints += itemPricePoints;
        }
    });

    return itemDescriptionPoints;
}

function calculateRetailerDateTimePoints(receiptBody) {
    console.log('calculateRetailerDateTimePoints');
    let dateTimeTotalPoints = 0;

    let receiptDateDay = moment(receiptBody.purchaseDate).date()

    if (receiptDateDay % 2 !== 0) {
        dateTimeTotalPoints += 6;
    }

    let receiptDateTime = moment(receiptBody.purchaseTime, ["HH:mm"]);
    let hHStartTime = moment("14:00", ["HH:mm"]).format();
    let hHEndTime = moment("16:00", ["HH:mm"]).format();

    if (receiptDateTime.isBetween(hHStartTime, hHEndTime)) {
        dateTimeTotalPoints += 10;
    }

    return dateTimeTotalPoints;
}

function isRoundDollarAmount(totalPointsNumber) {
    return !((totalPointsNumber - Math.floor(totalPointsNumber)) !== 0);
}

function isMultipleOfQuarter(totalPointsNumber) {
    const tolerance = 0.0001; // Define a small tolerance
    const remainder = totalPointsNumber % 0.25;
    return remainder <= tolerance || Math.abs(remainder - 0.25) <= tolerance;
}