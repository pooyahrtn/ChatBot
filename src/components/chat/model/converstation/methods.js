const { ChatSenders } = require('./constants');
const { PossibleAnswerBodyTypes } = require('../answer/constants');


exports.addQuestion = (instance, question) => {
    const chat = {
        sender: ChatSenders.from_server,
        message: {
            message_type: PossibleAnswerBodyTypes.text,
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
            body: answer.body,
            message_type: answer.body_type,
        },
        _id: answer._id,
    };
    instance.chats.push(chat);
    return instance;
};
