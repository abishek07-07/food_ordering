declare namespace Express {
  interface User {
    userID: number;
    email: string;
  }

  interface Request {
    userID?: number;
  }
}
