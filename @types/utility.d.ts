import { FieldPacket, RowDataPacket } from "mysql2";

declare module "utility" {
  type QueryResult<T> = [QueryResultRow<T>[], FieldPacket[]];
  type QueryResultRow<T> = T & RowDataPacket;
}
