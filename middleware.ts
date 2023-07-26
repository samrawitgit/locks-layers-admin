import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get("nextjs");
  // console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookiesReq = request.cookies.getAll();
  const response = NextResponse.next();
  const allCookiesRes = response.cookies.getAll();
  // console.log({ allCookiesReq, allCookiesRes }); // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has("nextjs"); // => true
  request.cookies.delete("nextjs");
  request.cookies.has("nextjs"); // => false

  // Setting cookies on the response using the `ResponseCookies` API
  // response.cookies.set("vercel", "fast");
  // response.cookies.set({
  //   name: "vercel",
  //   value: "fast",
  //   path: "/",
  // });
  // cookie = response.cookies.get("vercel");
  // console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.

  const authCookie = request.cookies.get("SID");
  // if (Object.keys(authCookie).length < 1) return false;

  console.log({ authCookie });
  if (request.url === "http://localhost:3000/api/logout") {
    response.cookies.delete("SID");
  } else {
    if (authCookie) {
      response.cookies.set("SID", authCookie.value);
    }
  }
  // console.log({ authCookie /* , resCookie: response.cookies.getAll() */ });

  return response;
}

// export const config = {
//   matcher: ["/api/login"],
// };
