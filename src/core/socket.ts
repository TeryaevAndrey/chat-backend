import { Server, Socket } from "socket.io";
import http from "http";

export default (http: http.Server) => {
  const io = new Server(http);

  io.on("connection", (socket: Socket) => {
    socket.on("DIALOGS:JOIN", (dialogId: string) => {
      (socket as any).dialogId = dialogId;
      socket.join(dialogId);
    });
  });

  return io;
};
