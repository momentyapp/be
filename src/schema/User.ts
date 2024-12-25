export default interface User {
  id: number;
  username: string;
  createdAt: string;
  password: string;
  salt: string;
  photo: string | null;
}
