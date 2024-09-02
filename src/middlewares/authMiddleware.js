const jwt = require('jsonwebtoken');

const User = require('../../src/models/User');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            message: 'Token not provided. Authorization denied.',
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded._id).select('-password');

        if (!user) {
            return res
                .status(400)
                .json({ message: 'Invalid token. User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.json({
            message: 'Authentication failed',
            error: error.message,
        });
    }
};

module.exports = authenticate;
