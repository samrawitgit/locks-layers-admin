import { withIronSessionApiRoute } from "iron-session/next";
import { AUTHENTICATION_COOKIE_OPTIONS } from "./login";

export default withIronSessionApiRoute(
  function userRoute(req, res) {
    res.send({ user: req.session.user });
  },
  {
    cookieName: process.env.authentication_cookie_name,
    password: process.env.secret_cookie_password,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: AUTHENTICATION_COOKIE_OPTIONS /* {
      secure: process.env.NODE_ENV === "production",
    }, */,
  }
);
