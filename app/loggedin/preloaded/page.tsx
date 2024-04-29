import { Numbers } from "@/app/loggedin/preloaded/Numbers";
import { auth } from "@/auth";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

export default async function PreloadedPage() {
  const session = await auth();
  const preloaded = await preloadQuery(
    api.myFunctions.listNumbers,
    { count: 10 },
    { token: session?.convexToken },
  );
  return <Numbers preloaded={preloaded} />;
}
