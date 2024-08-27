const User = require('../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

        return res
            .status(200)
            .json({ message: 'User login successfull', token: token });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error logged in', error: error.message });
    }
};

const forgotPassword = async (req, res) => {};

module.exports = {
    login,
    forgotPassword,
};
