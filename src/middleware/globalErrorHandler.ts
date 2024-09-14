import { NextFunction, Request, Response } from 'express';
import { THttpError } from '../types/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (error: THttpError, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(error.statusCode).json(error);
};

