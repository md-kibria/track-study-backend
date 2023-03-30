const User = require("../models/User");
const error = require("../utils/error");
// const bookService = require("./book");
const { ObjectId } = require("mongodb");
const compare = require("../utils/compareId");

const findAll = () => {
    return User.find();
};

const findByProperty = (key, value) => {
    // Find by id
    if (key == "id") {
        return User.findById(value);
    }

    // Find by property
    return User.findOne({ [key]: value });
};

const createUser = ({ name, email, password, roles, accountStatus }) => {
    // Create a new user and save it to db
    const user = new User({
        name,
        email,
        password,
        roles: roles ? roles : "USER",
        accountStatus: accountStatus ? accountStatus : "ACTIVE",
    });

    // Return created user
    return user.save();
};

const updateUser = async (id, user, data) => {
    // Find the targated user
    const targetUser = await findByProperty("id", id);

    // If user not found
    if (!targetUser) {
        throw error("User not found for update", 400);
    }

    // If authenticate user is targated user
    if (targetUser.id === user.id) {
        // If he want to update email
        if (data.email) {
            // Find user with the new email
            const user = await findByProperty("email", data.email);
            // If user found with the new email
            if (user) {
                throw error("Email already in use", 400);
            }
        }

        // Update and return the updated user
        return User.findByIdAndUpdate(id, { ...data }, { new: true });
    } else if (user.roles === "ADMIN" && targetUser.roles !== "SUPER_ADMIN") {
        // If authenticate user is Admin and trgated user is not super admin
        if (data.email) {
            // If new email already exist the throw error
            const user = await findByProperty("email", data.email);
            if (user) {
                throw error("Email already in use", 400);
            }
        }

        // Update and return updated user
        return User.findByIdAndUpdate(id, { ...data }, { new: true });
    } else if (user.roles === "SUPER_ADMIN") {
        // If authenticate user is super admin
        if (data.email) {
            // If new email already exist the throw error
            const user = await findByProperty("email", data.email);
            if (user) {
                throw error("Email already in use", 400);
            }
        }

        // Update and return updated user
        return User.findByIdAndUpdate(id, { ...data }, { new: true });
    } else {
        throw error("User is not in your scope", 400);
    }
};

const deleteUser = async (id, user) => {
    // Find the user
    const targetUser = await findByProperty("id", id);

    // If user not found
    if (!targetUser) {
        throw error("User not found for delete", 400);
    }

    if (user.id === id && user.roles !== "SUPER_ADMIN") {
        // If authenticate user and targated user are same and authenticate user not a super admin
        // Delete the user and return
        return User.findByIdAndDelete(id);
    } else if (user.roles === "ADMIN" && targetUser.roles !== "SUPER_ADMIN") {
        // If authenticate user is admin and targated user not a super admin
        // Delete the user and return
        return User.findByIdAndDelete(id);
    } else if (user.roles === "SUPER_ADMIN") {
        // If authenticate user is super admin
        if (targetUser.roles !== "SUPER_ADMIN") {
            // and targated user not a super admin
            // Delete the user and return
            return User.findByIdAndDelete(id);
        }

        // All super admins
        const superAdmins = await User.find({ roles: "SUPER_ADMIN" });

        // If super admin length is greater then 1
        if (superAdmins.length > 1) {
            // Delete the user(super admin) and return
            return User.findByIdAndDelete(id);
        } else {
            // If super admin length is 1, then throw error
            throw error("Atlast one super admin should have a account");
        }
    }
};

const addFavourite = async (user, bookId, tBook) => {
    try {
        // Find the user
        const tUser = await findByProperty("id", user._id);

        // If user not found
        if (!tUser) throw error("User not found for add to favourite", 404);

        // If user not author of the book
        if (!compare(tBook.user._id, user._id)) {
            throw error("This is not your book");
        }

        // Favourite list of user
        const favourites = tUser.favourites;

        // Variable for is the book is exist on user favourite book list, initial value is false
        let isExist = false;

        // Convert the bookId to Object
        const newBookId = new ObjectId(bookId);

        favourites.forEach((fav) => {
            let existBookId = new ObjectId(fav._id);
            // If really the book exist on favourite list
            if (newBookId.equals(existBookId)) {
                isExist = true;
            }
        });

        // If the book is really not exist on favourite list
        if (!isExist) {
            // then push it to favourite list
            favourites.push(bookId);
        } else {
            // Or throw error
            throw error("Already Added", 400);
        }

        // Finally update the user and return
        return User.findByIdAndUpdate(
            user._id,
            { $set: { favourites } },
            { new: true }
        ).populate('favourites');
    } catch (err) {
        throw error(err.message, 400);
    }
};

const removeFavourite = async (user, bookId) => {
    try {
        // Find the details of user
        const tUser = await findByProperty("id", user._id);

        // If user not found
        if (!tUser) throw error("User not found for remove favourite", 404);

        // Favourite list of user
        let favourites = tUser.favourites;

        // Is the book exist on favourite list
        let isExist = false;

        // Convert the bookId to Obje
        const newBookId = new ObjectId(bookId);

        favourites.forEach((fav) => {
            let existBookId = new ObjectId(fav._id);
            // If really the book exist on favourite list
            if (newBookId.equals(existBookId)) {
                isExist = true;
            }
        });

        if (!isExist) {
            // If book not exist on favourite list
            throw error("The book is not favourite", 400);
        } else {
            // If exist on favourite list, then remove it
            favourites = favourites.filter((fav) => {
                let existBookId = new ObjectId(fav._id);
                return !newBookId.equals(existBookId);
            });
        }

        // Finally update and return the user
        return User.findByIdAndUpdate(
            user._id,
            { $set: { favourites } },
            { new: true }
        ).populate('favourites');
    } catch (err) {
        throw error(err.message);
    }
};

const addBookmark = async (user, bookId, tBook) => {
    try {
        // Find the user
        const tUser = await findByProperty("id", user._id);

        // If user not found
        if (!tUser) throw error("User not found for add to favourite", 404);

        // If user not author of the book
        if (!compare(tBook.user._id, user._id)) {
            throw error("This is not your book");
        }

        // Bookmark list of the user
        const bookmarks = tUser.bookmarks;

        // Variable for is exixt the book on bookmark list
        let isExist = false;

        // Convert the bookId to Obje
        const newBookId = new ObjectId(bookId);

        bookmarks.forEach((bmrks) => {
            let existBookId = new ObjectId(bmrks._id);
            // If the book really exist on bookmark list
            if (newBookId.equals(existBookId)) {
                isExist = true;
            }
        });

        if (!isExist) {
            // If book is not exist on bookmarks, the push it to bookmarks
            bookmarks.push(bookId);
        } else {
            throw error("Already Added", 400);
        }

        // Finnaly update the book ane return it
        return User.findByIdAndUpdate(
            user._id,
            { $set: { bookmarks } },
            { new: true }
        ).populate('bookmarks');
    } catch (err) {
        throw error(err.message, 400);
    }
};

const removeBookmark = async (user, bookId) => {
    try {
        // Find the user
        const tUser = await findByProperty("id", user._id);

        // If user not exist
        if (!tUser) throw error("User not found for remove favourite", 404);

        // Bookmarks list
        let bookmarks = tUser.bookmarks;

        // Variable for is exixt the book on bookmark list
        let isExist = false;

        // Convert bookId to Obje
        const newBookId = new ObjectId(bookId);

        bookmarks.forEach((fav) => {
            let existBookId = new ObjectId(fav._id);
            // If the book really exist on bookmark list
            if (newBookId.equals(existBookId)) {
                isExist = true;
            }
        });

        if (!isExist) {
            // If book not exist on bookmarks
            throw error("The book is not in bookmark", 400);
        } else {
            // If exist on bookmarks, remove it from bookmarks
            bookmarks = bookmarks.filter((bmrks) => {
                let existBookId = new ObjectId(bmrks._id);
                return !newBookId.equals(existBookId);
            });
        }

        // Finally update and return the user
        return User.findByIdAndUpdate(
            user._id,
            { $set: { bookmarks } },
            { new: true }
        ).populate('bookmarks');
    } catch (err) {
        throw error(err.message, 400);
    }
};

module.exports = {
    findAll,
    findByProperty,
    createUser,
    updateUser,
    deleteUser,
    addFavourite,
    removeFavourite,
    addBookmark,
    removeBookmark,
};
