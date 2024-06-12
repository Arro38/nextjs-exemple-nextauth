import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import auth from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return new NextResponse(
      JSON.stringify({ error: "Username and password are required" }),
      { status: 400 }
    );
  }
  const res = await auth.handlers.POST({ username, password });
  console.log(res);

  // Check for errors in the response
  if (!res || res.status !== 200) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid username or password" }),
      { status: 400 }
    );
  }

  // Extract the JWT token from the response
  const { token } = await res.json();

  return new NextResponse(JSON.stringify({ token }), { status: 200 });
}
