import express from "express";
import path from "path";

const fileRouter = express.Router();

// 정적 파일 제공
fileRouter.use("/moment", express.static(path.resolve("files/moment")));
fileRouter.use("/profile", express.static(path.resolve("files/profile")));

export default fileRouter;
