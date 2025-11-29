import { ID } from "@/constants";

export interface Member {
    workspaceId: ID['workspaceId'];
    userId: ID['userId'];
    role: "admin" | "member";
}

export interface Member {
  _id: string;
  workspaceId: ID['workspaceId'];
  userId: ID['userId'];
  role: "admin" | "member";
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
}
