'use strict';

const { v4: uuidv4 } = require('uuid');

const _singleton = Symbol();

class InMemoryDb {
    constructor(singletonToken) {
        if (_singleton !== singletonToken) {
            throw new Error('Cannot instantiate InMemoryDb directly');

            this._receiptsCollection = new Map();
        }
    }

    static get instance() {
        if (!this._singleton) {
            this._singleton = new InMemoryDb(_singleton);
        }

        return this._singleton;
    }

    createReceiptDoc(receiptBody) {
        const receiptId = uuidv4();
    }

    retrieveReceiptDoc(receiptId) {}
}