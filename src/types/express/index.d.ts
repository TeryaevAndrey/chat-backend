declare namespace Express {
  export interface Request {
    userId: string;
    lastMessage?: string;
  }
}