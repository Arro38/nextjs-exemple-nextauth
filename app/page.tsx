import { auth } from "@/lib/auth";
import MyButton from "./MyButton";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1> Hello {session?.user?.email} </h1>
      <MyButton />
    </main>
  );
}
