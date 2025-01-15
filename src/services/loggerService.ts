import morgan, { StreamOptions } from 'morgan';
import fs from 'fs';
import path from 'path';

const logDirectory = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

export const requestLogger = morgan('combined', { stream: logStream });

export const devLogger = morgan('dev');

export const logInfo = (message: string): void => {
  console.log(`INFO: ${message}`);
  fs.appendFileSync(path.join(logDirectory, 'info.log'), `${new Date().toISOString()} - INFO: ${message}\n`);
};

export const logError = (message: string): void => {
  console.error(`ERROR: ${message}`);
  fs.appendFileSync(path.join(logDirectory, 'error.log'), `${new Date().toISOString()} - ERROR: ${message}\n`);
};
