import React, { useContext } from "react";
import { AppContext } from "@utils/containers/app.container";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { Paper, Typography, Box, Button } from "@mui/material";
import NextLinkComposed from "@components/NextLink/NextLink";

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
