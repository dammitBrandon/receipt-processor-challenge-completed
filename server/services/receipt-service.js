'use strict';

const InMemoryDb = require('../data-store/in-memory-db');

const {calculateReceiptPoints} = require('../utils');

const processReceipt = async (req, res, next) => {
    const receiptBody = req.body;

    try {
        const receiptDoc = InMemoryDb.createReceiptDoc({"points": calculateReceiptPoints(receiptBody), receiptBody});
        return res.status(201).json({'id': receiptDoc.id});
    } catch (error) {
        console.error('Error: ', error);
        next(error);
    }
}

const getReceipt = async (req, res, next) => {

    try {
        const receiptId = req.params.receiptId;
        const receiptDoc = InMemoryDb.retrieveReceiptDoc(receiptId);
        if (receiptDoc) {

        } else {
            return res.status(404).json({'error': 'No receipt found for that ID.'});
        }
        return res.status(200).json({ "points": receiptDoc.points });
    } catch (error) {
        console.error('Error: ', error);
        next(error);
    }
}

module.exports.processReceipt = processReceipt;
module.exports.getReceipt = getReceipt;