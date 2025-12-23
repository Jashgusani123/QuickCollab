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
  const { refreshUser, setUser } = useAuthContext();

  const loginUser = async ({ email, password }: LoginUserBody) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      return true;
    }
    return false;
  };

  const registerUser = async ({ name, email, password }: RegisterUserBody) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      return true;
    }
    return false;
  };

  return { loginUser, registerUser };
};
