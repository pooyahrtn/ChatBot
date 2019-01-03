const mongoose = require('mongoose');
const possibleAnswerSchema = require('../answer/answer.schema');


const questionSchema = new mongoose.Schema({
    is_starter: {
        type: Boolean,
        default: false,
    },
    is_the_end: {
        type: Boolean,
        default: false,
    },
    expected_answers: [possibleAnswerSchema],
    text: {
        type: String,
        maxlength: 400,
        required: true,
    },
});

module.exports = questionSchema;
