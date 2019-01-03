const { ChatKinds } = require('./constants');

exports.addQuestion = (instance, question) => {
    const chat = {
        kind: ChatKinds.from_server,
        question: question._id,
    };
    instance.chats.push(chat);
    return instance;
};
