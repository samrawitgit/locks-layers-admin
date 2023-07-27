import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// EXAMPLE   https://www.streaver.com/blog/posts/implementing-the-authentication-layer-in-nextjs

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("SID");
  const userIdCookie = request.cookies.get("UID");

  // You can also set request headers in NextResponse.rewrite
  const response = NextResponse.next();
  if (request.nextUrl.pathname === "/api/logout") {
    response.cookies.delete("SID");
    response.cookies.delete("UID");
    response.cookies.delete("token");
    response.cookies.delete("userId");
    return response;
  } else {
    if (request.cookies.has("userId") && request.cookies.has("token")) {
      const tokenCookie_ = request.cookies.get("token");
      const userIdCookie_ = request.cookies.get("userId");
      response.cookies.set({ ...tokenCookie_, name: "SID" });
      response.cookies.set({ ...userIdCookie_, name: "UID" });
    } else if (request.cookies.has("SID") && request.cookies.has("UID")) {
      response.cookies.set({ ...tokenCookie });
      response.cookies.set({ ...userIdCookie });
    }
    response.cookies.delete("token");
    response.cookies.delete("userId");
    return response;
  }

  // if (request.nextUrl.pathname === "/api/logout") {
  //   console.log("middle logout", {
  //     allCookiesReqIn,
  //     url: request.nextUrl.pathname,
  //   });
  //   response.cookies.delete("SID");
  //   response.cookies.delete("UID");
  // } else if (request.nextUrl.pathname !== "/api/login") {
  //   const tokenCookie = request.cookies.get("SID");
  //   const userIdCookie = request.cookies.get("UID");
  //   const allCookiesReq = request.cookies.getAll();
  //   console.log("middle not logout/login", {
  //     allCookiesReq,
  //     url: request.nextUrl.pathname,
  //   });
  //   if (request.cookies.has("SID") && request.cookies.has("UID")) {
  //     console.log("middle not logout & cookies present");
  //     // console.log("middle not login & cookies present", {
  //     //   allCookiesReq,
  //     //   tokenCookie,
  //     //   userIdCookie,
  //     //   url: request.nextUrl.pathname,
  //     // });
  //     response.cookies.set("SID", tokenCookie.value);
  //     response.cookies.set("UID", userIdCookie.value);
  //   }
  // } else {
  //   const allCookiesReq = request.cookies.getAll();
  //   console.log("middle /api/login", {
  //     allCookiesReq,
  //     url: request.nextUrl.pathname,
  //   });
  // }

  // console.log({ authCookie /* , resCookie: response.cookies.getAll() */ });
}

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
