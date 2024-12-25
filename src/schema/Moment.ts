export default interface Moment {
  id: number;
  userId: number | null;
  createdAt: string;
  expiresAt: string | null;
  text: string;
}
