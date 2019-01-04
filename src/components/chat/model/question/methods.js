const { Question } = require('.');

exports.greeting = () => Question.findOne({
    is_starter: true,
});

exports.addPossibleAnswer = (question, answer) => {
    question.expected_answers.push(answer);
};

/**
 * iterate throw question possible answers. 
 * return answer matches answer id
 */
exports.findAnswer = (question, answerId) =>
    question.expected_answers.find(item => item._id.equals(answerId));
