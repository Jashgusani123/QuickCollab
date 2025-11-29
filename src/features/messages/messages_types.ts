export interface UserType {
  id: string;
  name: string;
  email: string;
  avatar?: string | null; // optional since you don't have avatar yet
}

export interface MemberType {
  id: string;
  role: string;
}

export interface ReactionType {
  value: string;
  count: number;
  memberIds: string[];
}
export interface PaginationType {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


export interface MessageType {
  id: string;
  body: string ;
  imageUrl: string | null;
  member: MemberType;
  user: UserType;
  reactions: ReactionType[];
  threadCount: number;
  threadTimestamp: number;
  threadImage: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface MessagesResponse {
  success: boolean;
  data: MessageType[];
  pagination: PaginationType;
}


