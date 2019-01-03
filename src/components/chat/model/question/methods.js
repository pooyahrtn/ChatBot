const { Question } = require('.');

exports.greeting = () => Question.findOne({
    is_starter: true,
});

