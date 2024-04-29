# Convex + Next.js + Auth.js + Tailwind + shadcn/ui

This template provides a minimal setup to get Convex working with
[Next.js](https://nextjs.org/). It uses [Auth.js](https://authjs.dev) for user
authentication.

## Versions

There are 4 branches in this repo with increasingly sophisticated auth setup:

- [GitHub OAuth with no user storage](https://github.com/get-convex/convex-nextauth-template/tree/github-no-db)
- [GitHub OAuth with storing users in the DB](https://github.com/get-convex/convex-nextauth-template/tree/github)
- [GitHub OAuth + Magic Links](https://github.com/get-convex/convex-nextauth-template/tree/magiclink)
- [GitHub OAuth + Magic Links with session IDs](https://github.com/get-convex/convex-nextauth-template/tree/magiclink-session-jwt)

## Setting up

Clone the template and install dependencies:

```
npm create convex@latest -- -t get-convex/convex-nextauth-template#github-no-db
```

Then:

1. Run `npx convex dev --once`, and follow the steps to provision a Convex
   backend
2. Generate private and public key by running `node generateKeys.mjs`
   - Paste the private key to the `.env.local` file
   - Paste the public key to your Convex dashboard, which you can open by
     running `npx convex dashboard`
3. Generate a random secret (via `openssl rand -base64 33` or `npx auth secret`)
   and save it as `AUTH_SECRET` to the `.env.local` file
4. Follow
   [this guide](https://authjs.dev/guides/configuring-github#registering-your-app)
   to create a GitHub OAuth app and then add `AUTH_GITHUB_ID` and
   `AUTH_GITHUB_SECRET` to `.env.local`

Now your `.env.local` should match `.env.example` and there should be a `JWKS`
variable on your Convex dashboard.

You can now run:

```sh
npm run dev
```

and open your app at http://localhost:3000

See Convex docs at https://docs.convex.dev/home
