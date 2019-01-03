const mongoose = require('mongoose');
const questionSchema = require('./question.schema');


const Question = mongoose.model('Question', questionSchema);

exports.Question = Question;

