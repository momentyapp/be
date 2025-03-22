import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export default class Socket {
  public static io: SocketIOServer;
  public static topicSubscription: Map<string, Set<number>> = new Map();

  constructor(server: HTTPServer) {
    Socket.io = new SocketIOServer(server, { path: "/socket" });

    Socket.io.on("connection", (socket) => {
      Socket.topicSubscription.set(socket.id, new Set());

      // 주제 설정
      socket.on("set_topic", (topics: number[]) => {
        Socket.topicSubscription.set(socket.id, new Set(topics));
      });

      // 연결 해제
      socket.on("disconnect", () => {
        Socket.topicSubscription.delete(socket.id);
      });
    });
  }
}
