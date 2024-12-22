import { QueryError } from "mysql2";

const sqlErrorProperties = ["code", "errno", "sqlState", "sqlMessage"];

export default function isQueryError(error: Error): error is QueryError {
  return (
    error instanceof Error && sqlErrorProperties.every((prop) => prop in error)
  );
}
