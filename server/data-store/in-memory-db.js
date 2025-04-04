'use strict';

const { v4: uuidv4 } = require('uuid');

const _singleton = Symbol();

class InMemoryDb {
    constructor(singletonToken) {
        if (_singleton !== singletonToken) {
            throw new Error('Cannot instantiate InMemoryDb directly');
        }
        this._receiptsCollection = new Map();
    }

    static get instance() {
        if (!this._singleton) {
            this._singleton = new InMemoryDb(_singleton);
        }

        return this._singleton;
    }

    createReceiptDoc(receiptDocBody) {
        try {
            const receiptId = uuidv4();
            this._receiptsCollection.set(receiptId, {'id': receiptId, ...receiptDocBody});
            return this._receiptsCollection.get(receiptId);
        } catch (e) {
            return e;
        }
    }

    retrieveReceiptDoc(receiptId) {
        try {
            return this._receiptsCollection.get(receiptId)
        } catch (e) {
            return e;
        }
    }
}

module.exports = InMemoryDb.instance;