import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from "next";

import { AUTHENTICATION_COOKIE_OPTIONS } from "@pages/api/login";

const sessionOptions = {
  password: process.env.secret_cookie_password,
  cookieName: process.env.authentication_cookie_name,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: AUTHENTICATION_COOKIE_OPTIONS /* {
    secure: process.env.NODE_ENV === "production",
  } */,
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
  P extends {
    isLoggedIn: boolean;
    location?: any;
    allLocations?: any;
    token?: any;
    services?: any[];
    calendarData?: any;
  }
  // P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}

export type User = { token: string; userId: string; isLoggedIn: boolean };

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
