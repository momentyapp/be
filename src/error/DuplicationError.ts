import ClientError from "error/ClientError";
import hasJongseong from "util/hasJongseong";

export default class DuplicationError extends ClientError {
  constructor(duplicateValue: string) {
    const pathStringAsSubject = `${duplicateValue}${
      hasJongseong(duplicateValue) ? "이" : "가"
    }`;

    super(`${pathStringAsSubject} 이미 사용 중이에요.`);

    this.name = "DuplicationError";
    this.errorCode = "duplication_error";
    this.statusCode = 409;
  }
}
