import { Connection } from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';

export let rateLimiterMongo: RateLimiterMongo | null = null;

const DURATION = 60;
const POINTS = 10;

export const initRateLimiter = (mongooseConnection: Connection) => {
    rateLimiterMongo = new RateLimiterMongo({
        storeClient: mongooseConnection,
        points: POINTS,
        duration: DURATION
    });
};

