const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

module.exports = mongoose.model('Category', categorySchema);