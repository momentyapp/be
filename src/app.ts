import axios from "axios";
import cors from "cors";
import debug from "debug";
import dotenv from "dotenv";
import express from "express";

import apiRouter from "routes/api";
import fileRouter from "routes/file";
import setZodErrorMap from "util/setZodErrorMap";

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

axios.defaults.validateStatus = () => true;

// api 등록
const port = isProduction ? 8080 : 8081;
const app = express();
const log = debug("app:log");

const corsOptions: cors.CorsOptions = isProduction
  ? {
      origin: "https://example.com",
    }
  : {};

// zod 에러 메시지
setZodErrorMap();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", apiRouter);
app.use("/file", fileRouter);

app.listen(port, () => {
  log(`Server is running on port ${port}`);
});
