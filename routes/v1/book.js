const router = require("express").Router();
const bookController = require("../../controllers/book");
const auth = require("../../middlewares/auth");
const {
    addBookValidator,
    addBookValidatorHandler,
} = require("../../middlewares/validators/addBook");

// Get all book
router.get("/", auth, bookController.allBooks);

// Get single book
router.get("/:id", auth, bookController.getSingleBook);

// Add a book
router.post(
    "/add",
    auth,
    addBookValidator,
    addBookValidatorHandler,
    bookController.addBook
);

// Update book
router.put("/update/:id", auth, bookController.updateBook);

// Update book's chapter
router.put(
    "/update/:bookId/chapter/:chapterId",
    auth,
    bookController.updateChapter
);

// Update book's chapter's milestone
router.put(
    "/update/:bookId/chapter/:chapterId/milestone/:milestoneId",
    auth,
    bookController.updateMilestone
);

// Delete book
router.delete("/delete/:id", auth, bookController.deleteBook);

module.exports = router;
