import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { parse } from "cookie";

// EXAMPLE   https://www.streaver.com/blog/posts/implementing-the-authentication-layer-in-nextjs

export function middleware(request: NextRequest) {
  // You can also set request headers in NextResponse.rewrite

  const tokenCookie = request.cookies.get("SID");
  const userIdCookie = request.cookies.get("UID");

  const response = NextResponse.next();

  if (request.nextUrl.pathname === "/api/logout") {
    response.cookies.delete("SID");
    response.cookies.delete("UID");
    request.cookies.delete("SID");
    request.cookies.delete("UID");

    return response;
  } else {
    console.log({
      hasCook: !!request.headers.get("cookie"),
      hasSID: request.headers.get("cookie").includes("SID"),
      hasUID: request.headers.get("cookie").includes("UID"),
      hasCookSID: request.cookies.has("SID"),
      hasCookUID: request.cookies.has("UID"),
    });
    if (
      !!request.headers.get("cookie") &&
      request.headers.get("cookie").includes("SID") &&
      request.headers.get("cookie").includes("UID")
    ) {
      const headerCookies = parse(request.headers.get("cookie"));
      const tokenCookieH = headerCookies.SID;
      const userIdCookieH = headerCookies.UID;
      console.log("headersCook", { tokenCookieH, userIdCookieH });

      response.cookies.set({ ...tokenCookieH });
      response.cookies.set({ ...userIdCookieH });
    }

    response.cookies.set({ ...tokenCookie });
    response.cookies.set({ ...userIdCookie });

    return response;
  }
}

// export const config = {
//   // matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
//   matcher: ["/api/((?!login).*)"],
// };
