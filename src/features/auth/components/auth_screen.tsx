"use client"
import { useState } from "react"
import { SignInFlow } from "../request_response.typs"
import { SignInCard } from "./sign_in_card"
import { SignUpCard } from "./sign_up_card"

export const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>("signIn")
    return (
        <div className="h-full flex items-center justify-center bg_dark">
            <div className="md:h-auto md:w-[420px]">
                {state === "signIn" ? <SignInCard setState={setState}/> : <SignUpCard setState={setState}/>}
            </div>
        </div>
    )
}