const mongoose = require('mongoose');
const { PossibleAnswerBodyTypes } = require('./constants');

const possibleAnswerSchema = new mongoose.Schema({
    hint: {
        type: String,
    },
    body_type: {
        type: String,
        maxlength: 2,
        enum: [PossibleAnswerBodyTypes.text,
        PossibleAnswerBodyTypes.video,
        PossibleAnswerBodyTypes.voice,
        PossibleAnswerBodyTypes.image,
        ],
        required: true,
    },
    body: {
        type: String,
        maxlength: 400,
    },
    isOption: {
        type: Boolean,
        required: true,
    },
    nextQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question',
    },
});


module.exports = possibleAnswerSchema;
