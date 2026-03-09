import { createLogger, format, transports } from 'winston';
import { config } from '../config.js';

const bigIntReplacer = (_key: string, value: unknown) =>
  typeof value === 'bigint' ? value.toString() : value;

const errorSerializer = format((info) => {
  if (info['error'] instanceof Error) {
    const err = info['error'] as Error;
    info['error'] = {
      message: err.message,
      stack: err.stack,
      name: err.name,
    };
  }
  return info;
});

export const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    errorSerializer(),
    format.json({ replacer: bigIntReplacer }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta, bigIntReplacer)}` : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        }),
      ),
    }),
  ],
});
