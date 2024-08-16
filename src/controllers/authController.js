const userModel = require('../models/userModel.js');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        let data = req.body;
        const { userName, email, password } = data;

        if (!userName || !email || !password) {
            return res.status(400).json({
                status: false,
                message: `these are required fields - userName, email, password`
            });
        };

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: false,
                message: 'User already exists'
            });
        };

        const salt = await bcrypt.genSalt(10);
        let hasPassword = await bcrypt.hash(password, salt);
        data.password = hasPassword;

        const user = await userModel.create(data);
        return res.status(201).json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: `please enter email and password`
            });
        };

        const user = await userModel.findOne({ email }).select('-createdAt -updatedAt -__v');
        let checkPass = await bcrypt.compare(password, user.password);

        if (!user && !checkPass) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password'
            });
        };

        const token = await generateToken(user._id)
        return res.status(200).json({
            status: true,
            message: `logged In`,
            data: {
                token: token,
                user: user
            }
        });
    }
    catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    };
};

module.exports = { registerUser, loginUser };
