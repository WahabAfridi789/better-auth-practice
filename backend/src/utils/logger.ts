/**
 * Winston Logger Configuration
 *
 * This module provides a centralized logging system using Winston.
 * Logs are written to console and file based on environment.
 *
 * @module utils/logger
 */

import winston from "winston";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevel = process.env.LOG_LEVEL || "info";

/**
 * Custom log format with timestamp and colorization
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

/**
 * Console log format with colors
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      try {
        msg += ` ${JSON.stringify(meta)}`;
      } catch (error) {
        // Handle circular references by creating a safe copy
        const safeMeta = JSON.parse(
          JSON.stringify(meta, (key, value) => {
            // Remove circular references and problematic objects
            if (
              key === "req" ||
              key === "res" ||
              key === "socket" ||
              key === "connection"
            ) {
              return "[Circular]";
            }
            return value;
          }),
        );
        msg += ` ${JSON.stringify(safeMeta)}`;
      }
    }
    return msg;
  }),
);

/**
 * Winston logger instance
 */
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: "better-auth-backend" },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  // Disable exception handlers that collect OS info (causes EPERM on Node v22/macOS)
  handleExceptions: false,
  handleRejections: false,
});

/**
 * Stream for Morgan HTTP logging middleware
 */
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

/**
 * Log levels:
 * - error: 0
 * - warn: 1
 * - info: 2
 * - http: 3
 * - verbose: 4
 * - debug: 5
 * - silly: 6
 */
