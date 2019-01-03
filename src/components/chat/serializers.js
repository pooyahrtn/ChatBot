const _ = require('lodash');

function answerSerializer(answer) {
    return _.pick(answer, ['hint', 'body_type', 'body', 'isOption']);
}

function questionSerializer(question) {
    const justQuestion = _.pick(question, ['text']);
    return {
        ...justQuestion,
        expected_answers: question.expected_answers.map(answer => answerSerializer(answer)),
    };
}

exports.answerSerializer = answerSerializer;
exports.questionSerializer = questionSerializer;
