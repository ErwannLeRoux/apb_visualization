const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({

});

documentSchema.set('collection', 'data');

module.exports = mongoose.model('Document', documentSchema);
