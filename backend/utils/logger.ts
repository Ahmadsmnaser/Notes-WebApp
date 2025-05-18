import fs from 'fs';
import path from 'path';

const logFile = path.join(__dirname, '../log.txt');

export function logToFile(message: string) {
    const timestamp = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    fs.appendFileSync(logFile, `${timestamp} - ${message}\n`);
}
