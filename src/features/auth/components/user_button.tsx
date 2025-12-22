"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/context/auth.context"
import { Loader2, LogOut } from "lucide-react"

export const UserButton = () => {
    const {user , loading , logout} = useAuthContext();
    
    if(loading){
        return <Loader2 className="size-4 animate-spin text-muted-foreground"/>
    }

    if(!user){
        return null;
    }
    

    const avatarFallback = user.name.charAt(0).toUpperCase() ;
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative  border-2 rounded-full cursor-pointer hover:opacity-90 transition-opacity" >
                <Avatar className="size-10 hover:opacity-75">
                    <AvatarImage src={user.image} alt={user.name}/>
                    <AvatarFallback className="font-bold text-2xl font-mono text-(--sidebar-active)">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem onClick={()=>{logout()}} className="h-10 ">
                    <LogOut className="size-4 mr-2"/>Log out 
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}