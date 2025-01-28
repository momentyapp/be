import { FieldPacket, RowDataPacket } from "mysql2";

declare module "utility" {
  type QueryResult<T> = [QueryResultRow<T>[], FieldPacket[]];
  type QueryResultRow<T> = T & RowDataPacket;
  type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
}
