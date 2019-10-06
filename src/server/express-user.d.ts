declare module Express {
  interface User {
    name: string;
    accessToken: string;
    refreshToken: string;
  }
}