import { LoginUserBody, RegisterUserBody } from "../request_response.typs";
import { authApi } from "../constant.types";
import { useAuthContext } from "@/context/auth.context";
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
      
      if (response.statusText === "OK") {
        setUser(response.data.user)
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  };
 const registerUser = async ({ name, email, password }:RegisterUserBody) => {
    try {
      const res = await authApi.register({ name, email, password });
      if (res.statusText === "OK") {
        setUser(res.data.user)
        // await refreshUser(); // ✅ Automatically log user in
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };
  return { loginUser , registerUser };
};


