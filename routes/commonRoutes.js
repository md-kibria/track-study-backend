const rootRoute = (_req, res) => {
    res.status(200).json({
        msg: "All routes",
        users: {
            "all users - GET": "/api/v1/users/",
            "single user - GET": "/api/v1/users/:id",
            "register user - POST": "/api/v1/users/register",
            "login user - POST": "/api/v1/users/login",
            "update user - PATCH": "/api/v1/users/:id",
            "delete user - DELETE": "/api/v1/users/:id",
            favourites: {
                "all favourites - GET": "/api/v1/users/favourites",
                "add to favourites - POST":
                    "/api/v1/users/favourites/add/:bookId",
                "remove from favourites - DELETE":
                    "/api/v1/users/favourites/remove/:bookId",
            },
            bookmarks: {
                "all bookmarks - GET": "/api/v1/users/bookmarks",
                "add to bookmarks - POST":
                    "/api/v1/users/bookmarks/add/:bookId",
                "remove from bookmarks - DELETE":
                    "/api/v1/users/bookmarks/remove/:bookId",
            },
        },
        books: {
            "all books - GET": "/api/v1/books",
            "single book - GET": "/api/v1/books/:id",
            "add book - POST": "/api/v1/books/add",
            "update book - PUT": "/api/v1/books/update/:id",
            "update chapter - PUT":
                "/api/v1/books/update/:bookId/chapter/:chapterId",
            "update milestone - PUT":
                "/api/v1/books/update/:bookId/chapter/:chapterId/milestone/:milestoneId",
            "delete book - DELETE": "/api/v1/books/delete/:id",
        },
    });
};

const notFound = (_req, res) => {
    res.status(404).json({
        message: "Not found!",
    });
};

const error = (error, _req, res, _next) => {
    const message = error.message ? error.message : "Server error occurred";
    const status = error.status ? error.status : 500;

    console.log(error);

    res.status(status).json({
        message,
    });
};

module.exports = {
    rootRoute,
    notFound,
    error,
};
