const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const User = require("../models/User");
const { generateAccessToken, generateTokens } = require("../utils/generateToken");
const { validateUserRegistrationPayload, validateUserLoginPayload, validateRefreshToken } = require("../utils/validator");
const RefreshToken = require("../models/RefreshToken");


// Create user controller
const registerUser = async (req, res) => {
    try {
        if (!req.body) {
            logger.warn('Empty request body in register user', req.body);
            return res.status(400).json({
                status: 'failed',
                message: 'Validation failed'
            });
        }
        const { error } = validateUserRegistrationPayload(req.body);
        if (error) {
            logger.warn("Validation failed for Register user");
            return res.status(400).json({
                status: "failed",
                message: error.details[0].message
            });
        }

        // If the basic validation passes, then check for db level validation.
        logger.debug('Joi validation check passed for register user');
        const { email, password, display_name } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            logger.warn("User already exists with this email");
            return res.status(400).json({
                status: "failed",
                message: "User with this email already exists"
            })
        }

        const user = new User({ display_name, email, password });
        await user.save();
        logger.info(`user: ${email} created successfully`);

        const { accessToken, refreshToken } = await generateTokens(user);

        return res.status(201).json({
            status: 'success',
            tokens: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        logger.error("User registration error", error);
        res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        })
    }
}


const loginUser = async (req, res) => {
    try {
        const { error } = validateUserLoginPayload(req.body);
        if (error) {
            logger.warn("Login user validation failed");
            return res.status(400).json({
                status: 'failed',
                message: error.details[0].message
            });
        }

        // perform validation in database level.
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (!userExists) {
            logger.warn('Invalid credentials for Login');
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid credentials'
            })
        }

        const isPasswordsMatching = await userExists.comparePassword(password);
        if (!isPasswordsMatching) {
            logger.warn('Invalid credentials for login');
            return res.status(400).json({
                status: 'failed',
                message: 'Invalid credentials'
            })
        }

        const { accessToken, refreshToken } = await generateTokens(userExists);
        logger.info('Login successful')
        return res.status(200).json({
            status: 'success',
            message: 'Login successful',
            tokens: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        logger.error("Error occured in Login user", error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        })
    }
};


const refreshTokenForUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            logger.warn('Missing refresh token in the request');
            return res.status(400).json({
                status: 'failed',
                message: 'Missing refresh token'
            })
        }

        const existingToken = await RefreshToken.findOne({ token: refreshToken });
        const isValidToken = validateRefreshToken(existingToken);

        if (!isValidToken) {
            logger.warn('Refresh token expired');
            return res.status(400).json({
                status: 'failed',
                message: 'Token expired'
            })
        }
        
        const token = generateAccessToken(existingToken.user);
        logger.info(`Token refreshed for user: ${user._id}`);
        return res.status(200).json({
            status: 'success',
            message: 'token refreshed successfully',
            accessToken: token
        })
    } catch(error) {
        logger.error('Refresh token error', error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        })
    }
};


module.exports = {
    registerUser,
    loginUser,
    refreshTokenForUser
};