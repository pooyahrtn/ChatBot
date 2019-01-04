const Joi = require('joi');
const { PossibleAnswerBodyTypes } = require('./model/answer/constants');
const _ = require('lodash');

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
            body_type: Joi.string().valid(_.values(PossibleAnswerBodyTypes)).required(),
            body: Joi.string().max(400),
            is_option: Joi.boolean().required(),
            next_question: Joi.objectId().required(),
            hint: Joi.string().max(100),
        },
    },
    answer: {
        params: {
            session_id: Joi.objectId().required(),
        },
        body: {
            answer_id: Joi.objectId().required(),
            body: Joi.string(),
        },
    },
    showConverstation: {
        params: {
            session_id: Joi.objectId().required(),
        },
    },
};
