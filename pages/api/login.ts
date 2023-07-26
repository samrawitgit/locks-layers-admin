import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { cookies } from "next/headers";

export const AUTH_PROVIDER_BASE_URL = "http://localhost:8080";
const ONE_HR_IN_MS = 60 * 60 * 1000;

export const AUTHENTICATION_COOKIE_NAME = "SID";
export const AUTHENTICATION_COOKIE_OPTIONS = {
  sameSite: true,
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: ONE_HR_IN_MS,
};

export default async function handleLogin(req: NextRequest, res) {
  // Makes sure it's a POST request.
  if (req.method !== "POST") {
    return res.status(404).json({ message: "not found" });
  }

  // Grab the credentials from the request body.
  // We could do some payload validation, but in this example, we won't.
  const credentials = req.body; /* as LoginRequestBody;*/

  try {
    // Calls the authentication provider to log in.
    const loginResponse = await fetch(
      `${AUTH_PROVIDER_BASE_URL}/auth/admin-login`,
      {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // If the answer is not 2xx, we assume the credentials are invalid.
    if (!loginResponse.ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Reads the access token
    const { token } = await loginResponse.json(); /* as LoginResponseBody;*/
    console.log({ token });

    // Sets the access token as a cookie into the HTTP response
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(
        AUTHENTICATION_COOKIE_NAME,
        token,
        AUTHENTICATION_COOKIE_OPTIONS
      )
    );
    // res.cookies.set(
    //   AUTHENTICATION_COOKIE_NAME,
    //   cookie.serialize(token, AUTHENTICATION_COOKIE_OPTIONS)
    // );

    // console.log({ reqCook: req.cookies.getAll() });

    // let response = NextResponse.next();
    // // Set a cookie to hide the banner
    // response.cookies.set(
    //   AUTHENTICATION_COOKIE_NAME,
    //   token,
    //   AUTHENTICATION_COOKIE_OPTIONS
    // );

    return res.status(204).send(null); //200
  } catch (e) {
    // We could log the error or do something different with it.
    console.log({ e });
    return res.status(500).send({ message: "Internal server error" });
  }
}
