const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: '',
        },

        status: {
            type: String,
            enum: ['Pending', 'Completed'],
            default: 'Pending',
        },

        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },

        dueDate: {
            type: Date,
            default: null,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

    },
    { timestamps: true }

);

taskSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);