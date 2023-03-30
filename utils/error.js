const error = (msg = "Something went wrong", status = 500) => {
    const e = new Error(msg); // Create error with message
    e.status = status; // set error status
    return e; // Return error
};

module.exports = error;
