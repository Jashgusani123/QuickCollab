"use client"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SignInFlow } from "../request_response.typs"
import { useState } from "react"
import { useAuthContext } from "@/context/auth.context"
import { useAuthentication } from "../apis/authentication_api"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react"

interface SignUpCardProps {
    setState: (value: SignInFlow) => void
}
export const SignUpCard = ({ setState }: SignUpCardProps) => {
    const router = useRouter();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [isPanding, setIsPanding] = useState(false);

    const { refreshUser } = useAuthContext();
    const { registerUser } = useAuthentication();

    const handleRegisterConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPanding(true);

        try {
            if(password !== confirmPassword){
                return setError("Password is not equal")
            }
            const response = await registerUser({ name, email, password });
            if (!response) {
                toast.error("Sign up faild due to some resone")
            }
            await refreshUser();
            toast.success('Account Created !!');
            router.replace("/")
        } catch (error) {
            toast.error("Something want worng !!")
        } finally {
            setIsPanding(false)
        }

    }
    return (
        <Card className="w-full p-8 h-full">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign up to continue
                </CardTitle>
                <CardDescription>
                    Use your email or other service to continue
                </CardDescription>
            </CardHeader>
            {error &&(
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-2">
                    <TriangleAlert className="size-4"/>
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={handleRegisterConfirm}>
                    <Input
                        disabled={isPanding}
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        type="text"
                        required
                        placeholder="Name"
                    />
                    <Input
                        disabled={isPanding}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email"
                        required
                        placeholder="Email"
                    />
                    <Input
                        disabled={isPanding}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        type="password"
                        required
                        placeholder="Password"
                    />
                    <Input
                        disabled={isPanding}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value) }}
                        type="password"
                        required
                        placeholder="Confirm Password"
                    />
                    <Button type="submit" className="w-full" size={"lg"} disabled={isPanding}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    
                    <Button variant={"outline"}
                        size={"lg"}
                        className="w-full relative"
                        disabled={true}
                        onClick={() => { }}
                    >
                        <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
                        Continue with Google
                    </Button>
                    <Button variant={"outline"}
                        size={"lg"}
                        className="w-full relative"
                        disabled={true}
                        onClick={() => { }}
                    >
                        <FaGithub className="size-5 absolute top-2.5 left-2.5" />
                        Continue with Github
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Already have an account ? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signIn")}>Sign in</span>
                </p>
            </CardContent>
        </Card>
    )
}