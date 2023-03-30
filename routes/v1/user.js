const router = require("express").Router();
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/user");
const {
    registerValidator,
    registerValidatorHandler,
} = require("../../middlewares/validators/register");
const {
    loginValidator,
    loginValidatorHandler,
} = require("../../middlewares/validators/login");
const {
    changePasswordValidator,
    changePasswordValidatorHandler,
} = require("../../middlewares/validators/changePassword");

// Get all users
router.get("/", auth, userController.allUsers);

// favourites
router.get("/favourites/", auth, userController.allFavourites);
router.post("/favourites/add/:bookId", auth, userController.addFavourite);
router.delete(
    "/favourites/remove/:bookId",
    auth,
    userController.removeFavourite
);

// bookmarks
router.get("/bookmarks", auth, userController.allBookmarks);
router.post("/bookmarks/add/:bookId", auth, userController.addBookmark);
router.delete("/bookmarks/remove/:bookId", auth, userController.removeBookmark);

// Get single user
router.get("/:id", auth, userController.getSingleUser);

// Register user
router.post(
    "/register",
    registerValidator,
    registerValidatorHandler,
    userController.registerUser
);

// Login user
router.post(
    "/login",
    loginValidator,
    loginValidatorHandler,
    userController.loginUser
);

// Change password
router.post(
    "/password",
    auth,
    changePasswordValidator,
    changePasswordValidatorHandler,
    userController.changePassword
);

// Update user
router.patch("/:id", auth, userController.updateUser);

// Delete user
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
