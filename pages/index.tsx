import React, { useContext } from "react";
import { AppContext } from "@utils/containers/app.container";
import Head from "next/head";
import { Paper, Typography, Box, Button } from "@mui/material";
import NextLinkComposed from "@components/NextLink/NextLink";
import { GetServerSideProps } from "next";

function HomePage(props) {
  // console.log({ props });
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

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });
//   // const token = localStorage()
//   console.log({ session });
//   if (!session) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false, // it's only for this time not forerver
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Grabs the authentication cookie from the HTTP request
  const accessToken = context.req.cookies["SID"];
  // console.log({ accessToken });

  // Checks if the authentication cookie is set in the request and if it's valid

  // If it isn't, redirects the user to the login page
  if (!accessToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // In this example, we don't need the access token for anything on the client's side.
  // If we did, we could either pass the access token to the client via props
  // or we could decode the token, extract the data we need, and pass this data via props.
  return {
    props: { isLoggedIn: true },
  };
};
