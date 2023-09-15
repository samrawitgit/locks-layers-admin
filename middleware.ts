import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();

  return res;
};

/*
https://nextjs.org/docs/pages/building-your-application/routing/authenticating
https://github.com/nextauthjs/next-auth-example
https://github.com/vercel/next.js/tree/canary/examples/with-iron-session
https://github.com/vvo/iron-session#nextjs-usage
https://github.com/vvo/iron-session/blob/main/examples/next.js-typescript/pages/login.tsx
https://github.com/vvo/iron-session/blob/main/src/core.ts
https://github.com/jshttp/cookie#options-1
https://swr.vercel.app/docs/mutation.en-US
*/
