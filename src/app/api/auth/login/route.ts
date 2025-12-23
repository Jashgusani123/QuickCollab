// app/api/auth/login/route.ts
import { authApi } from "@/features/auth/constant.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const response = await authApi.login(body);

  const res = NextResponse.json({ user: response.data.user });
  res.cookies.set("token", response.data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
