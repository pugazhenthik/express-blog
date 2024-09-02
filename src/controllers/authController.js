const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { randomBytes } = require('crypto');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        return res
            .status(200)
            .json({ message: 'User login successfull', token: token });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error logged in', error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = randomBytes(32).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hr
        await user.save();

        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://${req.headers.host}/api/auth/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        // Send the email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error:' + error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res
            .status(200)
            .json({ message: 'Password reset email sent to your inbox' });
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong email not sent',
            error: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: 'Password reset token is invalid or has expired',
            });
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.password = password;
        await user.save();

        return res
            .status(200)
            .json({ message: 'Password has been reset successfully' });
    } catch (error) {
        return res.status(500).json({
            message: 'Error resetting password',
            error: error.message,
        });
    }
};

module.exports = {
    login,
    forgotPassword,
    resetPassword,
};
