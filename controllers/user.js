const userServices = require("../services/user");
const { register, login, password } = require("../services/auth");
const error = require("../utils/error");
const bookService = require("../services/book");

const allUsers = async (req, res, next) => {
    const user = req.user;
    try {
        if (user.roles === "USER") {
            throw error("Your are not an admin");
        }

        // Find and return users
        const users = await userServices
            .findAll()
            .select({ password: 0, __v: 0 });
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const getSingleUser = async (req, res, next) => {
    const { id } = req.params;
    const reqUser = req.user;

    try {
        if (String(reqUser._id) !== id && reqUser.roles === "USER") {
            throw error("This is not your account");
        }

        // Find user by user id
        const user = await userServices
            .findByProperty("_id", id)
            .select({ password: 0, __v: 0 });

        // If user not found
        if (!user) throw error("User not found", 400);

        // Return the user
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const registerUser = async (req, res, next) => {
    const { name, email, password, roles, accountStatus } = req.body;
    try {
        // Register and return user
        const user = await register({
            name,
            email,
            password,
            roles,
            accountStatus,
        });
        const token = await login({ email });
        return res.status(201).json({
            message: "Registred successfully",
            user,
            token,
        });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email } = req.body;
    try {
        // Generate auth token and return
        const token = await login({ email });
        return res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    const user = req.user;
    const body = req.body;
    try {
        const newUser = await password(user, body);
        res.status(200).json({
            message: "Password changed successfully",
            user: newUser,
        });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, roles, accountStatus } = req.body;
    const authUser = req.user;

    try {
        // Update user and return
        const user = await userServices.updateUser(id, authUser, {
            name,
            email,
            roles,
            accountStatus,
        });
        return res.status(200).json({
            message: "Updated successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const authUser = req.user;
    try {
        // Delete user and return
        const user = await userServices.deleteUser(id, authUser);
        return res.status(200).json({
            message: "User is deleted successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

const allFavourites = async (req, res, next) => {
    const { user } = req;
    try {
        // Find favourites of users and return
        const { favourites } = await userServices.findByProperty(
            "id",
            user._id
        ).populate('favourites');
        
        return res.status(200).json({
            message: "Favourite list",
            favourites,
        });
    } catch (err) {
        next(err);
    }
};

const addFavourite = async (req, res, next) => {
    const { bookId } = req.params;
    const { user } = req;
    try {
        // Find the book
        const tBook = await bookService.findByProperty("id", bookId);

        // If book not found
        if (!tBook) throw error("Book not found for add to favourite", 404);

        // Add to the user favourite list and return favourite list
        const { favourites } = await userServices.addFavourite(
            user,
            bookId,
            tBook
        );
        return res.status(200).json({
            message: "Added to favourite",
            favourites,
        });
    } catch (err) {
        next(err);
    }
};

const removeFavourite = async (req, res, next) => {
    const { bookId } = req.params;
    const { user } = req;
    try {
        // Remove from favourite list and return user
        const { favourites } = await userServices.removeFavourite(user, bookId);
        return res.status(200).json({
            message: "Removed from favourite",
            favourites,
        });
    } catch (err) {
        next(err);
    }
};

const allBookmarks = async (req, res, next) => {
    const { user } = req;
    try {
        // Find bookmarks and return
        const { bookmarks } = await userServices.findByProperty("id", user._id).populate('bookmarks');
        return res.status(200).json({
            message: "Bookmark list",
            bookmarks,
        });
    } catch (err) {
        next(err);
    }
};

const addBookmark = async (req, res, next) => {
    const { bookId } = req.params;
    const { user } = req;
    try {
        // Find the book
        const tBook = await bookService.findByProperty("id", bookId);

        // If book not found
        if (!tBook) throw error("Book not found for add to favourite", 404);

        // Add to the user bookmarks and return
        const { bookmarks } = await userServices.addBookmark(
            user,
            bookId,
            tBook
        );
        return res.status(200).json({
            message: "Added to bookmark",
            bookmarks,
        });
    } catch (err) {
        next(err);
    }
};

const removeBookmark = async (req, res, next) => {
    const { bookId } = req.params;
    const { user } = req;
    try {
        // Remove from user bookmarks and return
        const { bookmarks } = await userServices.removeBookmark(user, bookId);
        return res.status(200).json({
            message: "Removed from bookmarks",
            bookmarks,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    allUsers,
    getSingleUser,
    registerUser,
    loginUser,
    changePassword,
    updateUser,
    deleteUser,
    allFavourites,
    addFavourite,
    removeFavourite,
    allBookmarks,
    addBookmark,
    removeBookmark,
};
