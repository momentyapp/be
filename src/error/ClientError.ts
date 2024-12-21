export default class ClientError extends Error {
  public errorCode = "bad_request";
  public statusCode = 400;

  constructor(message: string) {
    super(message);
    this.errorCode;
    this.name = "ClientError";
  }
}
