# Convex + Next.js + Auth.js + Tailwind + shadcn/ui

This template provides a minimal setup to get Convex working with
[Next.js](https://nextjs.org/). It uses [Auth.js](https://authjs.dev) for user
authentication.

## Setting up

Clone the template and install dependencies:

```
npm create convex@latest -- -t get-convex/convex-nextauth-template
```

Then:

1. Run `npx convex dev --once`, and follow the steps to provision a Convex
   backend
2. Generate private and public key by running `node generateKeys.mjs`
   - Paste the private key `CONVEX_AUTH_PRIVATE_KEY=...` to the `.env.local`
     file
   - Paste the public key `JWKS=...` to your
     [Convex dashboard](https://dashboard.convex.dev/deployment/settings/environment-variables)
3. Generate a random secret (via `openssl rand -base64 33` or `npx auth secret`)
   and save it as `AUTH_SECRET` to the `.env.local` file
4. Generate another random secret and save it as `CONVEX_AUTH_ADAPTER_SECRET` to
   - the `.env.local` file
   - to your
     [Convex dashboard](https://dashboard.convex.dev/deployment/settings/environment-variables)
5. Follow
   [this guide](https://authjs.dev/guides/configuring-github#registering-your-app)
   to create a GitHub OAuth app and then add `AUTH_GITHUB_ID` and
   `AUTH_GITHUB_SECRET` to `.env.local`
6. Follow
   [this guide](https://authjs.dev/guides/configuring-resend#registering-your-app)
   to sign up for Resend and then add `AUTH_RESEND_KEY` to `.env.local`

Now your `.env.local` should match `.env.example` and there should be `JWKS` and
`CONVEX_AUTH_ADAPTER_SECRET` variables on your Convex dashboard.

You can now run:

```sh
npm run dev
```

and open your app at http://localhost:3000

See Convex docs at https://docs.convex.dev/home
