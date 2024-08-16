const jwt = require('jsonwebtoken');

const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
