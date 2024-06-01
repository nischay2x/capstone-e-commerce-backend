import Joi from "joi";

export function validateCreateProduct(req, res, next) {
    const { error, value } = Joi.object().keys({
        name: Joi.string().required().min(2).max(100),
        description: Joi.string().max(200),
        price: Joi.number().min(0).default(0),
        
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}

export function validateProductUpdate(req, res, next) {
    const { error, value } = Joi.object().keys({
        name: Joi.string().min(2).max(100),
        description: Joi.string().max(200),
        price: Joi.number().min(0),
        category: Joi.string().optional().allow(""),
        image: Joi.any().optional()
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}