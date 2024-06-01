import Joi from "joi";

export function validateAddCartItem(req, res, next) {
    const { error, value } = Joi.object().keys({
        productId: Joi.number().integer().required().min(1),
        quantity: Joi.number().integer().min(0).required()
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}

export function validateUpdateCartItem(req, res, next) {
    const { error, value } = Joi.object().keys({
        quantity: Joi.number().integer().min(0).required()
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}