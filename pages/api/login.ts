import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

const ONE_HR_IN_MS = 60 * 60 * 1000;

export const AUTHENTICATION_COOKIE_NAME = "SID";
export const AUTHENTICATION_COOKIE_OPTIONS = {
  sameSite: true,
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: ONE_HR_IN_MS,
};

export default async function handleLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Makes sure it's a POST request.
  if (req.method !== "POST") {
    return res.status(404).json({ message: "not found" });
  }

  // Grab the credentials from the request body.
  // We could do some payload validation, but in this example, we won't.
  const credentials = req.body; /* as LoginRequestBody;*/

  try {
    // Calls the authentication provider to log in.
    const loginResponse: Response = await fetch(
      `${process.env.backend_url}/auth/admin-login`,
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
    const loginResData = await loginResponse.json();

    const { token, userId } = loginResData; /* as LoginResponseBody;*/

    // Sets the access token & userId as a cookie into the HTTP response
    res.setHeader("Set-Cookie", [
      serialize("SID", token, AUTHENTICATION_COOKIE_OPTIONS),
      serialize("UID", userId, AUTHENTICATION_COOKIE_OPTIONS),
    ]);

    return res.status(204).send(null); //200
  } catch (e) {
    // We could log the error or do something different with it.
    console.log({ e });
    return res.status(500).send({ message: "Internal server error" });
  }
}
