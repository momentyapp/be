declare module "db" {
  interface UserRow {
    id: number;
    username: string;
    createdAt: string;
    password: string;
    salt: string;
  }

  interface TopicRow {
    id: number;
    name: string;
  }

  interface MomentRow {
    id: number;
    userId: number | null;
    createdAt: string;
    expiresAt: string | null;
    text: string;
  }

  interface MomentPhotoRow {
    momentId: number;
    path: number;
  }

  interface MomentTopicRow {
    momentId: number;
    topicId: number;
  }

  interface MomentReactionRow {
    momentId: number;
    userId: number;
    emoji: string;
  }
}
