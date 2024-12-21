import ClientError from "error/ClientError";

export default class InvalidTokenError extends ClientError {
  constructor(token: string) {
    super(`${token}이(가) 올바르지 않아요.`);

    this.name = "InvalidTokenError";
    this.errorCode = "invalid_token";
    this.statusCode = 401;
  }
}
