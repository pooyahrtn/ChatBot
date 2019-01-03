const mongoose = require('mongoose');
const questionSchema = require('./schema');


const Question = mongoose.model('Question', questionSchema);

exports.Question = Question;
exports.methods = require('./methods');

