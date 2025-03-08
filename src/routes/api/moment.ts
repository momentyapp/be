import express from "express";
import multer from "multer";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";
import parseJSON from "middleware/common/parseJSON";
import requireUserToken from "middleware/token/requireUserToken";
import requireUserTokenOptionally from "middleware/token/requireUserTokenOptionally";

import postMoment, {
  PostMomentRequestBody,
} from "controller/moment/postMoment";
import getMoments, {
  GetMomentsRequestBody,
} from "controller/moment/getMoments";
import reactMoment, {
  ReactMomentRequestBody,
} from "controller/moment/reactMoment";
import getTrendingMoments, {
  GetTrendingMomentsRequestQuery,
} from "controller/moment/getTrendingMoments";
import getMomentById, {
  GetMomentByIdRequestQuery,
} from "controller/moment/getMomentById";
import getMomentByIds, {
  GetMomentByIdsRequestBody,
} from "controller/moment/getMomentByIds";

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
  parseJSON,
  trimBodyString,
  validateRequest({ body: PostMomentRequestBody }),
  requireUserTokenOptionally,
  postMoment
);
momentRouter.post(
  "/get",
  express.json(),
  trimBodyString,
  validateRequest({ body: GetMomentsRequestBody }),
  requireUserTokenOptionally,
  getMoments
);
momentRouter.post(
  "/reaction",
  express.json(),
  trimBodyString,
  validateRequest({ body: ReactMomentRequestBody }),
  requireUserToken,
  reactMoment
);
momentRouter.get(
  "/trend",
  validateRequest({ query: GetTrendingMomentsRequestQuery }),
  requireUserTokenOptionally,
  getTrendingMoments
);
momentRouter.get(
  "/getById",
  validateRequest({ query: GetMomentByIdRequestQuery }),
  requireUserTokenOptionally,
  getMomentById
);
momentRouter.post(
  "/getByIds",
  express.json(),
  validateRequest({ body: GetMomentByIdsRequestBody }),
  requireUserTokenOptionally,
  getMomentByIds
);

export default momentRouter;
