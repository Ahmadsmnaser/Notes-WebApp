import { logToFile } from '../utils/logger';
import { Request, Response , NextFunction } from 'express';

const loggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    logToFile(`${req.method} ${req.url}`);
    next();
};

export default loggerMiddleware;
