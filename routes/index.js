const router = require("express").Router();
const commonRoutes = require("./commonRoutes");
const routerV1 = require("./v1");

// Version 1 api routes
router.use("/api/v1", routerV1);

// Root route
router.get("/", commonRoutes.rootRoute);

// Common routes (NotFound and Error)
router.use(commonRoutes.notFound);
router.use(commonRoutes.error);

module.exports = router;
