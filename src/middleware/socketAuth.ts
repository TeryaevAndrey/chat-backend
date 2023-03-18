import jwt from "jsonwebtoken";

const socketAuth = async (socket: any, next: any) => {
  if (await socket.handshake.query && await socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.SECRET_KEY! as string,
      (err: any, decoded: any) => {
        if (err) {
          return next(new Error("Auth error"));
        }
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    next(new Error("Auth error"));
  }
};

export default socketAuth;
