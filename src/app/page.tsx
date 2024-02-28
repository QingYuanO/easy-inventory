import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();
  console.log(session?.user.type);
  
  if (!session) redirect("/sign-in");
  return <main className=""></main>;
}
