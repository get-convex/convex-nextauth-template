/* eslint-disable @typescript-eslint/no-misused-promises */

import { signIn } from "@/auth";
import { StickyHeader } from "@/components/layout/sticky-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <StickyHeader className="px-4 py-2">
        <div className="flex justify-between items-center">
          Convex + Next.js + Auth.js
          <SignIn />
        </div>
      </StickyHeader>
      <main className="container max-w-2xl flex flex-col gap-8">
        <h1 className="text-4xl font-extrabold my-8 text-center">
          Convex + Next.js + Auth.js
        </h1>
        <p>Here is where your marketing message goes.</p>
        <p>The user doesn&apos;t need to log in to see it.</p>
        <p>To interact with the app log in via the button up top.</p>
      </main>
    </>
  );
}

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: "/loggedin" });
      }}
    >
      <Button type="submit">Sign in with GitHub</Button>
    </form>
  );
}
