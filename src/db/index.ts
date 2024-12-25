import mysql from "mysql2";

import * as moment from "./moment";
import * as user from "./user";

export const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  })
  .promise();

const db = { moment, user };
export default db;