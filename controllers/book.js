const bookServices = require("../services/book");
const compare = require("../utils/compareId");

const allBooks = async (req, res, next) => {
    const { user } = req;
    const { all } = req.query;
    try {
        // Find all books and return
        const books = await bookServices.findAll(user, all);
        return res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

const getSingleBook = async (req, res, next) => {
    const { id } = req.params;
    const { user } = req;
    try {
        // Find the single book and return
        const book = await bookServices.findByProperty("id", id);

        // If book not found
        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        // If authenticated person's roles is "user" and he is not the author the book
        if (user.roles === "USER" && !compare(user._id, book.user._id)) {
            return res.status(400).json({
                message: "This is not your book",
            });
        }

        // Return the book if authenticated person is the author of the book or "ADMIN" or "SUPER_ADMIN"
        return res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

const addBook = async (req, res, next) => {
    const { name, time, description, chapters } = req.body;
    const user = req.user;
    try {
        // Add a book and return
        const book = await bookServices.createBook(
            { name, time, description, chapters },
            user
        );
        return res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

const updateBook = async (req, res, next) => {
    const { name, description, note } = req.body;
    const { id } = req.params;
    const { user } = req;

    try {
        // Updated book and return
        const book = await bookServices.updateBook(
            id,
            {
                name,
                description,
                note,
            },
            user
        );

        return res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

const updateChapter = async (req, res, next) => {
    const { name, note } = req.body;
    const { bookId, chapterId } = req.params;
    const { user } = req;
    try {
        // Update chapter and return
        const book = await bookServices.updateChapter(
            bookId,
            chapterId,
            {
                name,
                note,
            },
            user
        );

        return res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

const updateMilestone = async (req, res, next) => {
    // add == true or add == false //-> true means add 1 more and false means less 1
    const { isDone, note, add } = req.body;
    const { bookId, chapterId, milestoneId } = req.params;
    const { user } = req;

    try {
        // Update milestone and return
        const book = await bookServices.updateMilestone(
            bookId,
            chapterId,
            milestoneId,
            { isDone, note, add },
            user
        );

        return res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

const deleteBook = async (req, res, next) => {
    const { id } = req.params;
    const { user } = req;
    try {
        // Delete book and return
        const book = await bookServices.deleteBook(id, user);

        return res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    allBooks,
    getSingleBook,
    addBook,
    updateBook,
    updateChapter,
    updateMilestone,
    deleteBook,
};
