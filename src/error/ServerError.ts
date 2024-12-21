export default class ServerError extends Error {
  constructor(
    public type = "ServerError",
    message: string, // internalMessage
    public externalMessage = "서버에서 오류가 발생하였습니다."
  ) {
    super(message);
    this.name = "ServerError";
  }
}
