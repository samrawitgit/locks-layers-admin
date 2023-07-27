import React from "react";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

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

const StyledMain = styled("main")({
  "@font-face": {
    fontFamily: "specialFont",
    src: 'url("/fonts/locks-layers-playfair-display-regular.ttf")',
  },

  h3: {
    fontFamily: "specialFont",
  },
});

export default function Layout(props) {
  const { isLoggedIn, children } = props;
  return (
    <ThemeProvider theme={theme}>
      {/* <div id="overlays" />
			<div id="modal-root" /> */}
      <Head>
        <title>Locks&Layers</title>
        <meta name="description" content="Locks&Layers locations" />
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      {isLoggedIn && <Navbar />}
      <StyledMain>{children}</StyledMain>
    </ThemeProvider>
  );
}
