import { LoginUserBody, RegisterUserBody } from "../request_response.typs";
import { authApi } from "../constant.types";
import { useAuthContext } from "@/context/auth.context";
import { NextResponse } from "next/server";
type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
} | null;

export const useAuthentication = () => {
  const { refreshUser  , setUser} = useAuthContext();

  const loginUser = async ({ email, password }: LoginUserBody) => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.status !== 200) {
        return false;
      }
      setUser(response.data.user)
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
 const registerUser = async ({ name, email, password }:RegisterUserBody) => {
    try {
      const res = await authApi.register({ name, email, password });
      if (res.status !== 200) {
        // await refreshUser(); // ✅ Automatically log user in
        return false;
      }
      setUser(res.data.user)
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  return { loginUser , registerUser };
};


