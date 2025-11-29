"use client"
import { CreateChannelModel } from "@/features/channel/components/create_channel_model";
import { CreateWorkspaceModel } from "@/features/workspace/components/create_workspace_model"
import { useEffect, useState } from "react"

export const Model = ()=>{
    const [mounted , setMounted] = useState(false);
    useEffect(()=>{
        setMounted(true)
    });

    if(!mounted) return null;
    return (
        <>
            <CreateChannelModel />
            <CreateWorkspaceModel />
        </>
    )
}