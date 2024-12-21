import { QueryError } from "mysql2";

export default function isQueryError(error: Error): error is QueryError {
  return error instanceof Error && "code" in error && "fatal" in error;
}
