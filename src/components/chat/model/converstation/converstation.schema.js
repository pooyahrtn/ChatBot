const mongoose = require('mongoose');

const possibleAnswerSchema = require('../answer/answer.schema');

const ChatKinds = {
    from_user: 'us',
    from_server: 'se',
};

const chatSchema = new mongoose.Schema({
    kind: {
        type: String,
        enum: [ChatKinds.from_server, ChatKinds.from_user],
        required: true,
        maxlength: 2,
    },
    qustion: {
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
