import api from "@/lib/axios";


export const channelApis = {
  getChannels:(workspaceId:string )=>api.get(`channels/get-channels/${workspaceId}`),
  createChannel:(workspaceId:string , name:string)=>api.post(`channels/create`,{workspaceId , name}),
  updateChannel:(channelId:string , name:string)=>api.post(`channels/update`,{channelId , name}),
  removeChannel:(channelId:string)=>api.delete(`channels/remove/${channelId}`),
  getChannel:(channelId:string)=>api.get(`channels/current/${channelId}`),
};
