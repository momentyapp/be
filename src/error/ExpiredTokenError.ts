import ClientError from "error/ClientError";
import hasJongseong from "util/hasJongseong";

export default class ExpiredTokenError extends ClientError {
  constructor(token: string, public expiredAt?: Date) {
    let errorMessage: string;
    const tokenStringAsSubject = `${token}${hasJongseong(token) ? "은" : "는"}`;

    if (expiredAt)
      errorMessage = `${tokenStringAsSubject} ${expiredAt.toLocaleString()}에 만료되었어요.`;
    else errorMessage = `${tokenStringAsSubject} 만료되었어요.`;

    super(errorMessage);

    this.name = "ExpiredTokenError";
    this.errorCode = "expired_token";
    this.statusCode = 401;
  }
}
