interface DecodedPayload {
  id: string;
  email: string;
}

export declare global {
  namespace Express {
    interface Request {
      session: { userJwt: any };
      currentUser: DecodedPayload;
    }
  }
}
