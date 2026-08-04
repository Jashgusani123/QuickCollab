export interface sentRequestBody {
  oppUserId: string;
}

export interface sentRequestResponse {
  success: boolean;
  message?: string;
}


export interface IncomingRequestItem {
  oppUserId: string;
  name: string;
  image?: string;
  createdAt: string;
  status: "pending";
}

export interface getAllRequestResponse {
  success: boolean;
  message?: string;
  sentRequests: string[];
  incomingRequests: IncomingRequestItem[];
  friends: string[];
}
