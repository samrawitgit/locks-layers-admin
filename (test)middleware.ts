import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth(
  async function middleware(req) {
    console.log({ req: req.nextauth.token });
    // const token = await getToken({ req, secret: "secret" });
    const token = localStorage.getItem("token");
    console.log({ token });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login"); /* ||
      req.nextUrl.pathname.startsWith("/register"); */
    const isApiPage = req.nextUrl.pathname.startsWith("/api");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(req.url);
      }
      return null;
    }

    if (isApiPage) {
      if (isAuth) {
        return NextResponse.next();
      }
    }

    if (!isAuth) {
      //       let from = req.nextUrl.pathname;
      //       if (req.nextUrl.search){
      // from += req.nextUrl.search
      //       }

      return NextResponse.redirect("/login");
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (token) return true;
      },
    },
    pages: { signIn: "/login" },
    // secret: process.env.NEXTAUTH_SECRET,
    secret: "secret",
  }
);

export const config = {
  matcher: ["/login"],
  // matcher: ["/login"],
};

// authorized({ req, token }) {
//   // `/admin` requires admin role
//   if (req.nextUrl.pathname === "/admin") {
//     return token?.userRole === "admin"
//   }
//   // `/me` only requires the user to be logged in
//   return !!token
// },

// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// const authRoutes = ["/login"];
// const protectedRoutes = [
//   "/index",
//   "/time-off/index",
//   "/staff/index",
//   "/salon/:path*",
// ];

// export function middleware(request: NextRequest) {
//   const currentUser = localStorage.getItem("user");
//   const token = localStorage.getItem("token");
//   const expiryDate = Date.parse(localStorage.getItem("expiryDate"));

//   if (
//     protectedRoutes.includes(request.nextUrl.pathname) &&
//     (!currentUser || Date.now() > expiryDate)
//   ) {
//     localStorage.delete("currentUser");
//     const response = NextResponse.redirect(new URL("/login", request.url));
//     localStorage.delete("currentUser");

//     return response;
//   }

//   if (authRoutes.includes(request.nextUrl.pathname) && currentUser) {
//     return NextResponse.redirect(request.url);
//   }
// }
