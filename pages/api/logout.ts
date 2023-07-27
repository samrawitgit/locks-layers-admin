import { AUTHENTICATION_COOKIE_NAME } from "./login";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handleLogout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    res.setHeader("Set-Cookie", [
      serialize(AUTHENTICATION_COOKIE_NAME, ""),
      serialize("UID", ""),
    ]);
    // res.writeHead(302, { Location: "/login" });
    // res.end();

    return res.status(200).send(null);
  } catch (err) {
    console.log({ err });
    return res.status(500).send({ msg: "cannot logout soz" });
  }
}
