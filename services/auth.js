const { findByProperty, createUser, updateUser } = require("./user");
const error = require("../utils/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async ({ name, email, password, roles, accountStatus }) => {
    // Find the user with email
    const user = await findByProperty("email", email);

    // If user has found
    if (user) throw error("Email already in use", 400);

    // Generate hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the new user
    return createUser({ name, email, password: hash, roles, accountStatus });
};

const login = async ({ email }) => {
    // Find the user with email
    const user = await findByProperty("email", email);

    // If user not found
    if (!user) throw error("User not found", 404);

    // If account status is "PENDING"
    if (user.accountStatus === "PENDING")
        throw error("Your account is not activated yet", 400);

    // If account status is "REJECTED"
    if (user.accountStatus === "REJECTED")
        throw error("Your account is rejected", 400);

    // JWT payload
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        accountStatus: user.accountStatus,
    };

    // Create token and return it
    return jwt.sign(payload, process.env.SECRET_KEY); // , {expiresIn: '2h'}
};

const password = async (user, body) => {
    const u = await findByProperty("email", user.email);
    if (!u) throw error("User not found for change password", 404);

    // Generate hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(body.password, salt);

    return updateUser(user._id, user, { password: hash });
};

module.exports = {
    register,
    login,
    password,
};
