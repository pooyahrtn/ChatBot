const Joi = require('joi');


module.exports = {
    addQuestion: {
        body: {
            is_starter: Joi.boolean(),
            text: Joi.string().max(400).min(10).required(),
        },
    },
    addAnswer: {
        body: {
            question_id: Joi.objectId().required(),
            king:
        }
    }
};
