const logger = require("../utils/logger");


const loggingHandler = (req, res, next) => {
    logger.info(`[${req.method}] - received for endpoint ${req.url}`);
    next();
}

module.exports = loggingHandler;