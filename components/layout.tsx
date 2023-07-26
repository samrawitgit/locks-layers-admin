import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Navbar from "./Navbar/Navbar";
import Head from "next/head";

const theme = createTheme({
  palette: {
    primary: {
      main: "#331E6D",
    },
    secondary: {
      main: "#FFCF31",
    },
  },
});

export default function Layout(props) {
  const { isLoggedIn, children } = props;
  console.log("layout", { isLoggedIn });
  return (
    <ThemeProvider theme={theme}>
      {/* <div id="overlays" />
			<div id="modal-root" /> */}
      <Head>
        <title>Locks&Layers</title>
        <meta name="description" content="Locks&Layers locations" />
      </Head>
      {isLoggedIn && <Navbar />}
      <main>{children}</main>
    </ThemeProvider>
  );
}
