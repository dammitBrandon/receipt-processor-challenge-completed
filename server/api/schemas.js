'use strict';

const Joi = require('joi');

const itemSchema = Joi.object({
    "shortDescription": Joi.string().required().pattern(new RegExp(/^[\w\s\-&]+$/)),
    "price": Joi.string().required().pattern(/^\d+\.\d{2}$/),
})

const receiptSchema = Joi.object({
    "retailer": Joi.string().required().pattern(new RegExp(/^[\w\s\-&]+$/)),
    "purchaseDate": Joi.string().required(),
    "purchaseTime": Joi.string().required(),
    "items": Joi.array().items(itemSchema).required(),
    "total": Joi.string().required().pattern(/^\d+\.\d{2}$/),
});

const validateRequest = (schema, options) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req, {
            ...options,
            convert: true,
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: { objects: true },
            debug: true,
            errors: {
                label: 'key'
            }
        });

        if (error) {
            next(error);
        }

        res.locals.validatedReq = value;
        next();
    };
};

module.exports.receiptSchema = receiptSchema;
module.exports.validateRequest = validateRequest;