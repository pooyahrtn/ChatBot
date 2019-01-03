const mongoose = require('mongoose');

const possibleAnswerSchema = require('../answer/schema');
const { ChatKinds } = require('./constants');


const chatSchema = new mongoose.Schema({
    kind: {
        type: String,
        enum: [ChatKinds.from_server, ChatKinds.from_user],
        required: true,
        maxlength: 2,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    },
    answer: {
        type: possibleAnswerSchema,
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

const converstationSchema = new mongoose.Schema({
    chats: [chatSchema],
    start_time: {
        type: Date,
        default: Date.now,
    },

});

module.exports = converstationSchema;
exports.ChatKinds = ChatKinds;
