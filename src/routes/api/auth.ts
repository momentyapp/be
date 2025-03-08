import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";
import parseJSON from "middleware/common/parseJSON";

import login, { LoginRequestBody } from "controller/auth/login";
import refreshToken, {
  RefreshTokenRequestBody,
} from "controller/auth/refreshToken";

const authRouter = express.Router();

// 컨트롤러
authRouter.post(
  "/login",
  parseJSON,
  trimBodyString,
  validateRequest({ body: LoginRequestBody }),
  login
);
authRouter.post(
  "/refresh",
  parseJSON,
  trimBodyString,
  validateRequest({ body: RefreshTokenRequestBody }),
  refreshToken
);

export default authRouter;
