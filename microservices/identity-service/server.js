require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const Redis = require("ioredis");
const mongoose = require("mongoose");
const express = require('express');
const loggingHandler = require("./middlewares/loggingMiddleware");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./utils/logger");

const app = express();


mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => logger.info('Connected to mongodb database'))
    .catch((err) => logger.error("Mongodb connection error", err));


const redisClient = new Redis(process.env.REDIS_URL);
const redisRateLimter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: 10,
    duration: 1
});


app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(loggingHandler);

app.use((req, res, next) => {
    redisRateLimter.consume(req.ip)
        .then(() => next())
        .catch(() => {
            logger.warn(`Rate limit exceeded for Ip ${req.ip}`);
            return res.status(429).json({
                status: 'failed',
                message: 'Too many requests'
            })
        })
});


const sensitiveEndpointsLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,

	// Redis store configuration
	store: new RedisStore({
		sendCommand: (...args) => redisClient.call(...args)
	}),
});


app.use('/api/auth/register', sensitiveEndpointsLimiter);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    logger.info(`Identity service up and running on port ${process.env.PORT}`);
});


process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled promise rejection', promise, 'reason', reason);
});