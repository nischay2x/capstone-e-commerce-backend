import Joi from "joi";


export function validateCreateUser(req, res, next){
    const { error, value } = Joi.object().keys({
        name: Joi.string().required().min(2).max(100),
        email: Joi.string().email().required().max(50),
        password: Joi.string().min(8).max(32).required(),
        role: Joi.string().valid("USER","SELLER").default("USER")
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}


export function validateUpdateUser(req, res, next){
    const { error, value } = Joi.object().keys({
        name: Joi.string().min(2).max(100).required()
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}

export function validatePasswordChange(req, res, next) {
    const { error, value } = Joi.object().keys({
        newPassword: Joi.string().min(8).max(32).required()
    }).validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.body = value;
    next();
}