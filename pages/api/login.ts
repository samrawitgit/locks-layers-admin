import { withIronSessionApiRoute } from "iron-session/next";

const HALF_HR_IN_MS = 60 * 30 * 1000;

export const AUTHENTICATION_COOKIE_OPTIONS = {
  sameSite: true,
  httpOnly: true,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  secure: process.env.NODE_ENV === "production",
  maxAge: HALF_HR_IN_MS,
  overwrite: true,
};

export default withIronSessionApiRoute(loginRoute, {
  cookieName: process.env.authentication_cookie_name,
  password: process.env.secret_cookie_password,
  ttl: HALF_HR_IN_MS,
  cookieOptions: AUTHENTICATION_COOKIE_OPTIONS,
});

async function loginRoute(req, res) {
  // Makes sure it's a POST request.
  if (req.method !== "POST") {
    return res.status(404).json({ message: "not found" });
  }

  // Grab the credentials from the request body.
  const credentials = req.body;

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

    const { token, userId } = loginResData;

    // get user from database then:
    req.session.user = {
      token,
      userId,
      admin: true,
      isLoggedIn: true,
    };
    await req.session.save();
    res.send({ ok: true });
  } catch (e) {
    // We could log the error or do something different with it.
    console.log({ e });
    return res.status(500).send({ message: "Internal server error" });
  }
}
