import passport from '../config/passport.js';

export const authenticate = passport.authenticate('jwt', { session: false });