declare module "common" {
  export interface Moment {
    id: number;
    author?: {
      id: number;
      username: string;
      createdAt: string;
      photo?: string;
    };
    createdAt: string;
    body: {
      text: string;
      photos?: string[];
    };
    topics: {
      id: number;
      name: string;
      trending?: boolean;
      count?: number;
    }[];
    reactions: {
      [reaction: string]: number;
    };
    expiresAt?: string;
    myEmoji?: string;
  }

  export interface Topic {
    id: number;
    name: string;
    trending?: boolean;
    usage?: number;
  }
}
