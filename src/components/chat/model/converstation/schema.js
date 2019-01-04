const mongoose = require('mongoose');
const { ChatSenders } = require('./constants');
const _ = require('lodash');
const { PossibleAnswerBodyTypes } = require('../answer/constants');

const messageSchema = new mongoose.Schema({
    message_type: {
        type: String,
        enum: _.values(PossibleAnswerBodyTypes),
        maxlength: 2,
    },
    body: {
        type: String,
        maxlength: 400,
    },
});

const chatSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: _.values(ChatSenders),
        required: true,
        maxlength: 2,
    },
    message: {
        type: messageSchema,
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
    is_ended: {
        type: Boolean,
        default: false,
    },

});

module.exports = converstationSchema;

