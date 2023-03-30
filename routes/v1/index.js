const router = require("express").Router();
const userRoutes = require("./user");
const bookRoutes = require("./book");

router.use("/users", userRoutes);
router.use("/books", bookRoutes);

module.exports = router;
