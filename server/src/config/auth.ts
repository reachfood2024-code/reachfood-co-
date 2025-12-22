import { env } from './env.js';

export const authConfig = {
  accessTokenSecret: env.JWT_ACCESS_SECRET,
  refreshTokenSecret: env.JWT_REFRESH_SECRET,
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  saltRounds: 12,
};
