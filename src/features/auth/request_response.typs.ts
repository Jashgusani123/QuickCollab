export type SignInFlow = "signIn" | "signUp";

export type LoginUserBody = {
    email:string,
    password:string
}
export type RegisterUserBody = {
    name:string,
    email:string,
    password:string
}

