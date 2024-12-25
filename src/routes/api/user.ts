import express from "express";
import multer from "multer";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";
import parseJSON from "middleware/common/parseJSON";

import signup, { SignupRequestBody } from "controller/user/signup";

const userRouter = express.Router();

// multer 객체 생성
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1,
  },

  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(null, false);
  },
});

// 컨트롤러
userRouter.post(
  "/",
  upload.single("photo"),
  parseJSON,
  trimBodyString,
  validateRequest({ body: SignupRequestBody }),
  signup
);

export default userRouter;
