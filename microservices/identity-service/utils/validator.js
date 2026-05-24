const Joi = require("joi");


const validateUserRegistrationPayload = (data) => {    
    const schema = Joi.object({
        display_name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

const validateUserLoginPayload = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    return schema.validate(data);
};

const validateRefreshToken = (token) => {
    const today = new Date();
    return token.expiresAt < today;
}


module.exports = { 
    validateUserRegistrationPayload, 
    validateUserLoginPayload,
    validateRefreshToken
};