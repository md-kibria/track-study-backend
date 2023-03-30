const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    // left: {
    //     type: Number,
    //     required: true,
    //     default: 0,
    // },
    extra: {
        type: Number,
        required: true,
        default: 0,
    },
    unbindTime: {
        type: Number,
        required: true,
        default: 0,
    },
    start: {
        type: Date,
        default: Date.now,
        required: true,
    },
    end: {
        type: Date,
        default: Date.now,
        required: true,
    },
    note: {
        type: String,
    },
    completed: {
        type: Number,
        default: 0,
        required: true,
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    chapters: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                },
                pages: {
                    type: Number,
                    required: true,
                },
                time: {
                    type: Number,
                    required: true,
                },
                // left: {
                //     type: Number,
                //     required: true,
                //     default: 0,
                // },
                extra: {
                    type: Number,
                    required: true,
                    default: 0,
                },
                start: {
                    type: Date,
                    default: Date.now,
                    required: true,
                },
                end: {
                    type: Date,
                    default: Date.now,
                    required: true,
                },
                note: {
                    type: String,
                },
                completed: {
                    type: Number,
                    default: 0,
                    required: true,
                },
                milestones: {
                    type: [
                        {
                            name: {
                                type: String,
                                required: true,
                            },
                            pages: {
                                type: Number,
                                // required: true,
                            },
                            sPage: {
                                type: Number,
                                // required: true,
                            },
                            ePage: {
                                type: Number,
                                // required: true,
                            },
                            time: {
                                type: Number,
                                required: true,
                            },
                            extra: {
                                type: Number,
                                required: true,
                                default: 0,
                            },
                            date: {
                                type: Date,
                                default: Date.now,
                                required: true,
                            },
                            note: {
                                type: String,
                            },
                            isDone: {
                                type: Boolean,
                                default: false,
                                required: true,
                            },
                            type: {
                                type: String,
                                default: "MILESTONE",
                                enum: ["MILESTONE", "EXTRA"],
                                required: true,
                            },
                        },
                    ],
                    default: [],
                },
            },
        ],
        default: [],
    },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
