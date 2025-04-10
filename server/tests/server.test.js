const {describe,test, expect, beforeEach} = require('@jest/globals');
const request = require('supertest');
const app = require('../config/express');

describe('Test basic routes', () => {
    test("GET /status path should respond with 200 status: 'ok'", async () => {
        const response = await request(app).get('/status');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'ok' }); // Added this assertion for better testing
    });


    test('POST /receipts/process, should process a basic receipt and return an ID', async () => {
        const receipt = {
            retailer: "Target",
            purchaseDate: "2022-01-01",
            purchaseTime: "13:01",
            items: [
                {
                    shortDescription: "Mountain Dew 12PK",
                    price: "6.49"
                },{
                    shortDescription: "Emils Cheese Pizza",
                    price: "12.25"
                },{
                    shortDescription: "Knorr Creamy Chicken",
                    price: "1.26"
                },{
                    shortDescription: "Doritos Nacho Cheese",
                    price: "3.35"
                },{
                    shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
                    price: "12.00"
                }
            ],
            total: "35.35"
        };

        const response = await request(app)
            .post('/receipts/process')
            .send(receipt)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    test('GET /receipts/:receiptId/points, should return 109 points', async () => {
        const receipt = {
            "retailer": "M&M Corner Market",
            "purchaseDate": "2022-03-20",
            "purchaseTime": "14:33",
            "items": [
                {
                    "shortDescription": "Gatorade",
                    "price": "2.25"
                },{
                    "shortDescription": "Gatorade",
                    "price": "2.25"
                },{
                    "shortDescription": "Gatorade",
                    "price": "2.25"
                },{
                    "shortDescription": "Gatorade",
                    "price": "2.25"
                }
            ],
            "total": "9.00"
        };

        const receiptResponse = await request(app)
            .post('/receipts/process')
            .send(receipt)
            .expect(201);

        const receiptId = receiptResponse.body.id;

        const response = await request(app).get(`/receipts/${receiptId}/points`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ points: 109 });
        expect(response.body.points).toEqual(109);
    })
});