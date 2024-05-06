import ConvexClientProvider from "@/app/ConvexClientProvider";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Session } from "next-auth";

export const getServerSideProps = (async (ctx) => {
  const session = await auth(ctx);

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps<{ session: Session | null }>;

export default function Page({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ConvexClientProvider session={session}>
      <Content />
    </ConvexClientProvider>
  );
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </>
    );
  }

  return (
    <>
      <p className="mt-8">Welcome {viewer ?? "N/A"}!</p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        <Button
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
        </Button>
      </p>
      <p>
        Numbers:{" "}
        {numbers?.length === 0
          ? "Click the button!"
          : numbers?.join(", ") ?? "..."}
      </p>
    </>
  );
}
