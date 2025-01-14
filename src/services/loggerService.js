import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const logStream = fs.createWriteStream(path.join('logs', 'access.log'), { flags: 'a' });

export const requestLogger = morgan('combined', { stream: logStream });
export const devLogger = morgan('dev');

export const logInfo = (message) => {
  console.log(`INFO: ${message}`);
  fs.appendFileSync('logs/info.log', `${new Date().toISOString()} - INFO: ${message}\n`);
};

export const logError = (message) => {
  console.error(`ERROR: ${message}`);
  fs.appendFileSync('logs/error.log', `${new Date().toISOString()} - ERROR: ${message}\n`);
};
