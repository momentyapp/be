import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";

import signup, { SignupRequestBody } from "controller/user/signup";

const userRouter = express.Router();

// 컨트롤러
userRouter.post(
  "/",
  express.json(),
  trimBodyString,
  validateRequest({ body: SignupRequestBody }),
  signup
);

export default userRouter;
