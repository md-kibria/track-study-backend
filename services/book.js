const Book = require("../models/Boook");
const { addDays, isToday, isAfter } = require("date-fns");
const createChapters = require("../utils/createChapters");
const error = require("../utils/error");
const {
    setCompletedBook,
    setCompletedChapter,
} = require("../utils/setCompleted");
const userServices = require("./user");
const { ObjectId } = require("mongodb");
const compare = require("../utils/compareId");

const findAll = (user, all = false) => {
    if (Boolean(all)) {
        if (user.roles === "SUPER_ADMIN" || user.roles === "ADMIN") {
            return Book.find();
        } else if (user.roles === "USER") {
            return Book.find({ user });
        }
    } else {
        return Book.find({ user });
    }
};

const findByProperty = (key, value) => {
    if (key === "id") {
        return Book.findById(value);
    }

    return Book.find({ [key]: value });
};

const createBook = async (data, user) => {
    // name, time, description, chapters -> date object
    const time = Math.floor(data.time / data.chapters.length);
    const trmTime = time * data.chapters.length;
    const unbindTime = data.time - trmTime;

    const book = new Book({
        name: data.name,
        time: data.time - unbindTime,
        // left: data.time - unbindTime,
        extra: 0,
        unbindTime,
        start: new Date(),
        end: addDays(new Date(), data.time - unbindTime - 1),
        note: "",
        completed: 0,
        description: data.description,
        user,
        chapters: createChapters(data.chapters, time),
    });

    return book.save();
};

const updateBook = async (id, data, user) => {
    try {
        const book = await findByProperty("id", id);

        if (!book) throw error("Book not found for update", 404);

        if (!compare(user._id, book.user._id)) {
            throw error("This is not your book", 400);
        }

        const obj = {
            name: data.name || book.name,
            description: data.description || book.description,
            note: typeof data.note !== "undefined" ? data.note : book.note,
        };
        return Book.findByIdAndUpdate(id, { ...obj }, { new: true });
    } catch (err) {
        throw error(err.message);
    }
};

const updateChapter = async (bookId, chapterId, data, user) => {
    try {
        const book = await findByProperty("id", bookId);

        if (!book) throw error("Book not found for update chapter");

        if (!compare(user._id, book.user._id))
            throw error("This is not your book", 400);

        let chapters = JSON.stringify(book.chapters);
        chapters = JSON.parse(chapters);

        const cpter = chapters.filter((chapter) => chapter._id == chapterId)[0];
        const obj = {
            name: data.name || cpter.name,
            note: typeof data.note !== "undefined" ? data.note : cpter.note,
        };

        chapters = chapters.map((chapter) => {
            if (chapter._id == chapterId) {
                let newObj = { ...chapter, ...obj };
                return newObj;
            } else {
                return chapter;
            }
        });

        return Book.findByIdAndUpdate(bookId, { chapters }, { new: true });
    } catch (err) {
        throw error(err.message, 400);
    }
};

const updateMilestone = async (bookId, chapterId, milestoneId, data, user) => {
    try {
        const book = await findByProperty("id", bookId);

        if (!book) throw error("Book not found for update milestone", 404);

        if (!compare(user._id, book.user._id)) {
            throw error("This is not your book", 400);
        }

        let chapters = JSON.stringify(book.chapters);
        chapters = JSON.parse(chapters);

        const { milestones } = chapters.filter(
            (chapter) => chapter._id === chapterId
        )[0];
        const mile = milestones.filter((ml) => ml._id == milestoneId)[0];
        const more =
            typeof data.add !== "undefined"
                ? data.add
                    ? mile.extra + 1
                    : mile.extra !== 0
                    ? mile.extra - 1
                    : mile.extra
                : mile.extra;

        const terr = () => {
            throw error("The milestone end date has not come yet.");
            return mile.date;
        };
        const obj = {
            isDone:
                typeof data.isDone !== "undefined"
                    ? data.isDone
                        ? isToday(new Date(mile.data)) || isAfter(new Date(), new Date(mile.date))
                            ? true
                            : terr()
                        : mile.isDone
                    : mile.isDone,
            note: typeof data.note !== "undefined" ? data.note : mile.note,
            extra: more,
            end: addDays(new Date(mile.end), more),
        };

        chapters = chapters.map((chapter) => {
            const chapterMore =
                typeof data.add !== "undefined"
                    ? data.add
                        ? chapter.extra + 1
                        : mile.extra > 0
                        ? chapter.extra - 1
                        : chapter.extra
                    : chapter.extra;

            if (chapter._id == chapterId) {
                return {
                    ...chapter,
                    extra: chapterMore,
                    milestones: chapter.milestones.map((mile) => {
                        if (mile._id == milestoneId) {
                            return {
                                ...mile,
                                ...obj,
                            };
                        } else {
                            return mile;
                        }
                    }),
                    completed: setCompletedChapter(
                        chapter,
                        data.isDone !== "undefined" ? (data.isDone ? 1 : 0) : 0
                    ),
                    end: addDays(new Date(chapter.end), chapterMore),
                };
            } else {
                return chapter;
            }
        });

        const bookMore =
            typeof data.add !== "undefined"
                ? data.add
                    ? book.extra + 1
                    : mile.extra > 0
                    ? book.extra - 1
                    : book.extra
                : book.extra;

        return Book.findByIdAndUpdate(
            bookId,
            {
                extra: bookMore,
                chapters,
                completed: setCompletedBook({ ...book, chapters }),
                end: addDays(new Date(book.end), bookMore),
            },
            { new: true }
        );
    } catch (err) {
        throw error(err, 400);
    }
};

const deleteBook = async (id, user) => {
    try {
        const book = await findByProperty("id", id);

        if (!book) throw error("Book not found for delete", 400);

        if (!compare(user._id, book.user._id))
            throw error("This is not your book", 400);

        const bookId = new ObjectId(id);
        let isFavourite = false;
        let isBookmark = false;

        // Is favourite
        user.favourites.filter((fav) => {
            const favId = new ObjectId(fav._id);
            if (bookId.equals(favId)) {
                isFavourite = true;
            } else {
                isFavourite = false;
            }
        });

        // Remove from favourites
        if (isFavourite) {
            await userServices.removeFavourite(user, id);
        }

        // Is bookmark
        user.bookmarks.filter((bmrk) => {
            const bmrkId = new ObjectId(bmrk._id);
            if (bookId.equals(bmrkId)) {
                isBookmark = true;
            } else {
                isBookmark = false;
            }
        });

        // Remove from bookmarks
        if (isBookmark) {
            await userServices.removeBookmark(user, id);
        }

        return Book.findByIdAndDelete(id);
    } catch (err) {
        throw error(err.message, 400);
    }
};

module.exports = {
    findAll,
    findByProperty,
    createBook,
    updateBook,
    updateChapter,
    updateMilestone,
    deleteBook,
};
