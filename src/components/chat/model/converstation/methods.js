const { ChatSenders } = require('./constants');
const { PossibleAnswerBodyTypes } = require('../answer/constants');

exports.addQuestion = (instance, question) => {
    const chat = {
        sender: ChatSenders.from_server,
        message: {
            type: PossibleAnswerBodyTypes.text,
            body: question.text,
        },
        _id: question._id,
    };
    instance.chats.push(chat);
    return instance;
};

exports.addAnswer = (instance, answer) => {
    const chat = {
        sender: ChatSenders.from_user,
        message: {
            type: answer.body_type,
            body: answer.body,
        },
        _id: answer._id,
    };
    instance.chats.push(chat);
    return instance;
};
