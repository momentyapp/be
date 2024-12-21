import ClientError from "error/ClientError";

export default class MissingHeaderError extends ClientError {
  constructor(missingHeader: string) {
    super(`${missingHeader} 헤더가 누락됐어요.`);

    this.name = "MissingHeaderError";
    this.errorCode = "missing_header";
    this.statusCode = 400;
  }
}
