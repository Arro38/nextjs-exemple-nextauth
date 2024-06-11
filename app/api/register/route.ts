import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return new NextResponse(
      JSON.stringify({ error: "Username and password are required" }),
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User already exists" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    return new NextResponse(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("An error occurred while registering:", error);
    return new NextResponse(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      { status: 500 }
    );
  }
}
