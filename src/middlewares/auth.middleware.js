import passport from '../config/passport.js';

export class AuthMiddleware {
  constructor(passportInstance = passport) {
    this.authenticate = passportInstance.authenticate('jwt', { session: false });
  }
}

export const authenticate = new AuthMiddleware().authenticate;