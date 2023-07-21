import { getToken } from "next-auth/jwt";
// import jwt from "jsonwebtoken";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // If you don't have the NEXTAUTH_SECRET environment variable set,
  // you will have to pass your secret as `secret` to `getToken`
  // const token = await getToken({
  //   req,
  //   secret: "secret",
  //   maxAge: 60 * 60 * 1000,
  // });
  const token = localStorage.getItem("token");
  console.log({ token });
  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2));
  } else {
    // Not Signed in
    console.log("not signed in");
    res.status(401);
  }
  res.end();
}
