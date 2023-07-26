// import { NextRequest, NextResponse } from "next";

import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE_NAME } from "./login";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function handleLogout(request: NextRequest, res) {
  // console.log({ cook: req.cookies });
  try {
    // req.cookies.clear();
    // console.log("api/logout", { request });
    // request.cookies.delete(AUTHENTICATION_COOKIE_NAME);
    // const response = NextResponse.next();
    // response.cookies.delete(AUTHENTICATION_COOKIE_NAME);
    // cookies().set({
    //   name: AUTHENTICATION_COOKIE_NAME,
    //   value: "",
    //   expires: new Date("2016-10-05"),
    //   path: "/", // For all paths
    // });
    return res.status(200).send({ mes: "bye" });
  } catch (err) {
    console.log({ err });
    return res.status(500).send({ msg: "cannot logout soz" });
  }
}
