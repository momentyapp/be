import express from "express";
import multer from "multer";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";

import postMoment, {
  PostMomentRequestBody,
} from "controller/moment/postMoment";
import getMoments, {
  GetMomentsRequestBody,
} from "controller/moment/getMoments";

const momentRouter = express.Router();

// multer 객체 생성
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 10,
  },

  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(null, false);
  },
});

// 컨트롤러
momentRouter.post(
  "/",
  upload.array("photos"),
  trimBodyString,
  validateRequest({ body: PostMomentRequestBody }),
  postMoment
);
momentRouter.post(
  "/get",
  express.json(),
  trimBodyString,
  validateRequest({ body: GetMomentsRequestBody }),
  getMoments
);

export default momentRouter;
