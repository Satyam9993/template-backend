const User = require("../models/user");
const { CatchAsync } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
require("dotenv").config();

const Secret = process.env.ACTIVATION_SECRET;

// Register User
exports.registrationUser = CatchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Email and password are required", 400));
        }

        const isEmailExist = await User.findOne(email).lean()
        if (isEmailExist) {
            return next(new ErrorHandler("Email Already Exist", 400));
        }

        await User.create({ email, password });

        res.status(201).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// login user
exports.loginUser = CatchAsync(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        const accessToken = await user.SignAccessToken();

        return res.status(200).json({
            success: true,
            user,
            accessToken,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// TODO: update password
exports.resetPassword = CatchAsync(async (req, res, next) => {
    try {
        const { email, accessCode, newPassword } = req.body;

        if (!email || !accessCode || !newPassword) {
            return next(
                new ErrorHandler("Please enter email, access code, and new password", 400)
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorHandler("Invalid email", 400));
        }

        if (user.accessCode !== accessCode) {
            return next(new ErrorHandler("Invalid access code", 400));
        }

        await user.resetPassword(newPassword);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
