"use client";
import { signIn, signOut } from "next-auth/react";

export default function MyButton() {
  return (
    <div>
      <button onClick={() => signIn()}>Sign in</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
