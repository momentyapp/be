import express from "express";

import validateRequest from "middleware/validate/validateRequest";
import trimBodyString from "middleware/common/trimBodyString";
import parseJSON from "middleware/common/parseJSON";


const authRouter = express.Router();

// 컨트롤러
authRouter.post(
  "/",
  parseJSON,
  trimBodyString,
  
);

export default authRouter;
