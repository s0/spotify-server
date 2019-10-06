declare module 'passport-spotify' {
  import * as passport from 'passport';
  export class Strategy<User> extends passport.Strategy {
    constructor(
      options: {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
      },
      callback: (
        accessToken: string,
        refreshToken: string,
        expires_in: unknown,
        profile: {
          id: string;
          username: string;
          displayName: string;
          profileUrl: string;
          photos: string[];
        },
        done: (
          err: unknown,
          user: User
        ) => void
      ) => void);
  }
}