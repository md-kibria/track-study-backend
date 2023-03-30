const { ObjectId } = require("mongodb");

const compare = (firstId, secondId) => {
    // Convery these id
    const first = new ObjectId(firstId);
    const second = new ObjectId(secondId);

    // If these two id are equal or not
    if (first.equals(second)) {
        return true;
    } else {
        return false;
    }
};

module.exports = compare;
