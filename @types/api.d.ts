declare module "api" {
  type ApiResponse<T = undefined> = {
    message: string;
    code: string;
    result?: T;
  };
}
