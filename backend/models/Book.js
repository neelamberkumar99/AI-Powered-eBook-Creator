const mongoose = require('mongoose');
const cheptorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    content: {
        type: String,
        default: "",
    },
});
const bookSchema = new mongoose.Schema({
    userid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: "",
    },
    author: {
        type: String,
        required: true,
    },
    coverimage: {
        type: String,
        default: "",
    },
    chepters: [cheptorSchema],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model('Book', bookSchema);
