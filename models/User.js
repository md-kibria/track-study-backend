const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        required: true,
        enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        default: ['USER']
    },
    accountStatus: {
        type: String,
        required: true,
        enum: ['PENDING', 'ACTIVE', 'REJECTED'],
        default: 'PENDING'
    },
    favourites: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book"
            }
        ],
        default: [],
        required: true
    },
    bookmarks: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book"
            }
        ],
        default: [],
        required: true
    },
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User