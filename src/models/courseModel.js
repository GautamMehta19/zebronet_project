const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
