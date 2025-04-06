'use strict';

const Joi = require('joi');

const itemSchema = Joi.object({
    shortDescription: Joi.string().required().pattern(/^[\w\s\-&]+$/),
    price: Joi.string().required().pattern(/^\d+\.\d{2}$/),
});

const receiptSchema = Joi.object({
    retailer: Joi.string().required().trim(),
    purchaseDate: Joi.string().required(),
    purchaseTime: Joi.string().required(),
    items: Joi.array().items(itemSchema).required(),
    total: Joi.string().required().pattern(/^\d+\.\d{2}$/),
});

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true,
        });

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                error: 'Validation failed',
                details: errorMessage
            });
        }

        req.validatedBody = value;
        next();
    };
};

module.exports = {
    receiptSchema,
    validateRequest
};