const mongoose = require('mongoose');
const { PossibleAnswerBodyTypes } = require('./constants');
const _ = require('lodash');

const possibleAnswerSchema = new mongoose.Schema({
    hint: {
        type: String,
        maxlength: 100,
    },
    body_type: {
        type: String,
        maxlength: 2,
        enum: _.values(PossibleAnswerBodyTypes),
        required: true,
    },
    body: {
        type: String,
        maxlength: 400,
    },
    is_option: {
        type: Boolean,
        required: true,
    },
    next_question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question',
    },
});


module.exports = possibleAnswerSchema;
