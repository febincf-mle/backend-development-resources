const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RefreshToken = require("../models/RefreshToken");


const generateAccessToken = (userData) => {
    return jwt.sign({
        userId: userData._id,
        email: userData.email
    }, process.env.JWT_SECRET_KEY, { expiresIn: '60m' });
}

const generateTokens = async (userData) => {
    const accessToken = jwt.sign({
        userId: userData._id,
        email: userData.email
    }, process.env.JWT_SECRET_KEY, { expiresIn: '60m' });

    // populate the refresh token, with expiration set to 7 days.
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
        token: refreshToken,
        user: userData._id,
        expiresAt
    })

    return { accessToken, refreshToken };
};


module.exports = { generateAccessToken, generateTokens };