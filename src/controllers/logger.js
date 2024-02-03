import winston from 'winston';

// Create a logger with console transport
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${process.env.HOST || 'localhost'} ${timestamp} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Middleware to log requests
export const requestLogger = (req, res, next) => {
  const { method, url, ip } = req;
  logger.info(`[${method}] ${url} - Client IP: ${ip}`);
  next();
};
