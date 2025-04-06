const moment = require("moment/moment");

const calculateReceiptPoints = function (receiptBody) {
    let totalPoints = 0;

    totalPoints += calculateRetailerNamePoints(receiptBody);
    totalPoints += calculateRetailerTotalPoints(receiptBody);
    totalPoints += calculateRetailerItemsPoints(receiptBody);
    totalPoints += calculateRetailerItemDescriptionPoints(receiptBody);
    totalPoints += calculateRetailerDateTimePoints(receiptBody);

    return totalPoints;
};

function calculateRetailerNamePoints(receiptBody) {
    let nameTotalPoints = 0;
    const alphaNumericRegex = /[a-zA-Z0-9]/g;

    nameTotalPoints += receiptBody.retailer.match(alphaNumericRegex).length;

    return nameTotalPoints;
}

function calculateRetailerTotalPoints(receiptBody) {
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
    let itemsTotalPoints = 0;
    let numberOfItems = receiptBody.items.length;

    if (numberOfItems === 0) {
        return 0;
    }

    if (numberOfItems % 2 === 0) {
        itemsTotalPoints = (numberOfItems / 2) * 5;
    } else {
        itemsTotalPoints = ((numberOfItems - 1) / 2) * 5;
    }

    return itemsTotalPoints;
}

function calculateRetailerItemDescriptionPoints(receiptBody) {
    let itemDescriptionPoints = 0;

    if (receiptBody.items.length === 0) {
        return 0;
    }

    receiptBody.items.forEach((item) => {
        if (item.shortDescription.trim().length % 3 === 0) {
            let itemPricePoints = Math.ceil(item.price * 0.2);
            itemDescriptionPoints += itemPricePoints;
        }
    });

    return itemDescriptionPoints;
}

function calculateRetailerDateTimePoints(receiptBody) {
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

module.exports.calculateReceiptPoints = calculateReceiptPoints;