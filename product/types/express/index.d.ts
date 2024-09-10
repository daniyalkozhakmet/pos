declare namespace Express {
  interface Request {
    user: {
      id: string;
      email: string;
      shop: string;
      role: string;
      first_name: string;
      last_name: string;
      iat: number;
      exp: number;
    };
  }
}
