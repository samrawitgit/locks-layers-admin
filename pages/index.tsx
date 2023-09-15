import React from "react";
import Head from "next/head";
import { Paper, Typography, Box, Button } from "@mui/material";

import NextLinkComposed from "@components/NextLink/NextLink";
import { withSessionSsr } from "@utils/.";

function HomePage(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#cac9e1",
      }}
    >
      <Head>
        <title>Locks&Layers</title>
        <meta name="description" content="Locks&Layers admin application" />
      </Head>
      <Paper
        elevation={0}
        square
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: "43vw",
          paddingX: "20px",
          alignItems: "center",
          height: "calc(100vh - 110px)",
          justifyContent: "space-evenly",
        }}
      >
        <Typography variant="h2">Welcome</Typography>
        <Box sx={{ minHeight: "30%" }}>
          <Typography variant="h5">
            To manage locations navigate to{" "}
            <Button
              component={NextLinkComposed}
              to={"/salons"}
              sx={{ backgroundColor: "#cac9e1", fontWeight: "bold" }}
            >
              SALONS
            </Button>
          </Typography>
          <Typography variant="h5" sx={{ mt: 10 }}>
            To request Staff off days navigate to{" "}
            <Button
              component={NextLinkComposed}
              to={"/time-off"}
              sx={{ backgroundColor: "#cac9e1", fontWeight: "bold" }}
            >
              STAFF
            </Button>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}

export default HomePage;

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    // Grabs the authentication cookie from the session
    const user = req.session.user;

    // Checks if the authentication cookie is set in the request and if it's valid
    // If it isn't, redirects the user to the login page

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: { user: user, isLoggedIn: true },
    };
  }
);
