const _ = require('lodash');

function answerSerializer(answer) {
    return _.pick(answer, ['hint', 'body_type', 'body', 'is_option', '_id']);
}

function questionSerializer(question) {
    const justQuestion = _.pick(question, ['text']);
    return {
        ...justQuestion,
        expected_answers: question.expected_answers.map(answer => answerSerializer(answer)),
    };
}

// function converstationSerializer(converstation) {
//     return '';
// }

exports.answerSerializer = answerSerializer;
exports.questionSerializer = questionSerializer;
