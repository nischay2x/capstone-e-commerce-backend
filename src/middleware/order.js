import Joi from "joi";

export function validateCreateOrder(req, res, next) {
    const { error, value } = Joi.object().keys({
        address: Joi.string().required().min(5).max(150),
        phoneNumber: Joi.string().min(10).max(10).regex(/[0-9]+/).required(),
        paymentMode: Joi.string().valid("CASH", "UPI", "CARD", "ONLINE").default("CASH")
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}