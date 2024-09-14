import { NextFunction, Request } from 'express';
import errorObject from './errorObject';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export default (nextFunction: NextFunction, error: Error | unknown, req: Request, errorStatusCode: number = 500): void => {
    const errorObj = errorObject(error, req, errorStatusCode);
    return nextFunction(errorObj);
};

