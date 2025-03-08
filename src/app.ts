import axios from "axios";
import cors from "cors";
import debug from "debug";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

import apiRouter from "routes/api";
import fileRouter from "routes/file";
import setZodErrorMap from "util/setZodErrorMap";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

axios.defaults.validateStatus = () => true;

// 서버 설정
const port = isProduction ? 6061 : 7071;
export const app = express();
export const server = createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/file", fileRouter);

const log = debug("app:log");

// zod 에러 메시지
setZodErrorMap();

// socket.io 등록
export const io = new Server(server, { path: "/socket" });

app.set("socket", io);

server.listen(port, () => {
  log(`Server is running on port ${port}`);
});
