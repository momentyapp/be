declare module "db" {
  interface UserRow {
    id: number;
    username: string;
    createdAt: string;
    password: string;
    salt: string;
  }

  interface Topic {
    id: number;
    name: string;
  }

  interface moment {
    id: number;
    userId: number;
    createdAt: string;
    expiresAt?: string;
    text: string;
  }

  interface moment_photo {
    momentId: number;
    path: number;
  }

  interface moment_topic {
    momentId: number;
    topicId: number;
  }

  interface moment_reaction {
    momentId: number;
    userId: number;
    emoji: string;
  }
}
