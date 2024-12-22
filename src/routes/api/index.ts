import express from "express";

import userRouter from "./user";
import momentRouter from "./moment";

import userErrorHandler from "middleware/error/clientErrorHandler";
import errorHandler from "middleware/error/errorHandler";
import serverErrorHandler from "middleware/error/serverErrorHandler";
import zodErrorHandler from "middleware/error/zodErrorHandler";

const apiRouter = express.Router();

// 라우터 등록
apiRouter.use("/user", userRouter);
apiRouter.use("/moment", momentRouter);

// 에러 핸들 미들웨어
apiRouter.use(
  zodErrorHandler,
  userErrorHandler,
  serverErrorHandler,
  errorHandler
);

// 존재하지 않는 api에 대한 처리
userRouter.use((req, res) => {
  res
    .status(404)
    .json({ message: "존재하지 않는 api입니다.", code: "api_not_exists" });
});

export default apiRouter;
