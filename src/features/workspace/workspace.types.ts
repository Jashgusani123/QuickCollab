export type CreateWorkspaceBody = {
  name: string;
};

export type InviteMemberBody = {
  workspaceId: string;
  joinCode: string;
};

export type WorkspaceType = {
  _id: string;
  name: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  members: {
    user: {
      _id: string;
      name: string;
      email: string;
    };
    role: "admin" | "member";
  }[];
};

export interface Workspace {
  _id: string;
  name: string;
  userId: string;
  joinCode:string;
}

export interface WorkspacesResponse {
  success: boolean;
  message?: string;
  workspaces: Workspace[] ;
}
export interface WorkspaceResponse {
  success: boolean;
  message?: string;
  workspaces: Workspace ;
}
export interface WorkspaceUpdatedResponse {
  success:boolean;
  message?:string;
  workspace:Workspace
}
export interface CreatedWorkspaceResponse {
  success:boolean;
  message?:string;
  workspaceId?:string;
}

export interface InviteMemberResponse {
  workspaceId: string;
  joinCode: string; // email
}
