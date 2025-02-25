import ClientError from "error/ClientError";
import hasJongseong from "util/hasJongseong";

export default class NotFoundError extends ClientError {
  constructor(target: string) {
    const pathStringAsSubject = `${target}${
      hasJongseong(target) ? "이" : "가"
    }`;

    super(`${pathStringAsSubject} 존재하지 않아요.`);

    this.name = "NotFoundError";
    this.errorCode = "notfound_error";
    this.statusCode = 404;
  }
}
