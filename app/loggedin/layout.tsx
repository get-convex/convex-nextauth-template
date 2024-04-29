/* eslint-disable @typescript-eslint/no-misused-promises */

import ConvexClientProvider from "@/app/ConvexClientProvider";
import { auth, signOut } from "@/auth";
import { StickyHeader } from "@/components/layout/sticky-header";
import { Button } from "@/components/ui/button";

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <StickyHeader className="px-4 py-2">
        <div className="flex justify-between items-center">
          Convex + Next.js + Auth.js
          <SignOut />
        </div>
      </StickyHeader>
      <main className="container max-w-2xl flex flex-col gap-8">
        <ConvexClientProvider session={session}>
          {children}
        </ConvexClientProvider>
      </main>
    </>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button type="submit">Sign out</Button>
    </form>
  );
}
