const mongoose = require('mongoose');
const converstationSchema = require('./converstation.schema');

const Converstation = mongoose.model('Converstation', converstationSchema);

exports.Converstation = Converstation;
