import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SignInFlow } from "../request_response.typs"
import { useState } from "react"
import { useAuthentication } from "../apis/authentication_api"
import { toast } from "sonner"
import { useAuthContext } from "@/context/auth.context"
import { useRouter } from "next/navigation"


interface SignInCardProps {
    setState: (value: SignInFlow) => void
}
export const SignInCard = ({ setState }: SignInCardProps) => {
    const router = useRouter();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isPanding, setIsPanding] = useState(false);

    const { refreshUser } = useAuthContext();
    const { loginUser } = useAuthentication();

    const handleLoginConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPanding(true);
        try {
            const response = await loginUser({ email, password });
            if (!response) {
                toast.error("Login faild due to some reason")
                // setEmail("")
                // setPassword("")
                return
            }
            await refreshUser();
            toast.success('Logged In');
            router.replace("/")
        } catch (error) {
            toast.error("Something want worng !!")
        } finally {
             setEmail("")
                setPassword("")
            setIsPanding(false)
        }

    }

    return (
        <Card className="w-full p-8 h-full">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Login to continue
                </CardTitle>
                <CardDescription>
                    Use your email or other service to continue
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={handleLoginConfirm}>
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
                    Don't have an account ? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signUp")}>Sign up</span>
                </p>
            </CardContent>
        </Card>
    )
}