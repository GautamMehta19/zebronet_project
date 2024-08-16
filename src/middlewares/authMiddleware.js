const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const auth = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "params id not present"
            })
        }

        let token = req.headers["authorization"]
        if (!token) {
            return res.status(400).json({
                status: false,
                message: "token is not present"
            })
        }
        if (!token.startsWith('Bearer ')) {
            return res.status(400).json({
                status: false,
                message: "token should be Bearer token"
            })
        }
        token = token.split(' ')[1]
        const userLoggedIn = jwt.verify(token, process.env.JWT_SECRET);

        const checkUserId = await User.findById(id).select('-password');
        if (!checkUserId) {
            return res.status(400).json({
                status: false,
                message: "params id not present in User DB"
            })
        }
        if (checkUserId._id != userLoggedIn._id) {
            return res.status(403).json({
                status: false,
                message: "Autherization Failed"
            })
        }
        req.user = checkUserId;
        next();
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };

};

module.exports = { auth };
