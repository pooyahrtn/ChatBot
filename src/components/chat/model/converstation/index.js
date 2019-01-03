const mongoose = require('mongoose');
const converstationSchema = require('./schema');
const methods = require('./methods');

const Converstation = mongoose.model('Converstation', converstationSchema);

exports.Converstation = Converstation;
exports.methods = methods;
