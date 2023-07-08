import React, { useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Navbar from "./Navbar/Navbar";
import { AppContext } from "@utils/containers/app.container";

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

export default function Layout({ children }) {
  const { isLoggedIn } = useContext(AppContext);
  return (
    <ThemeProvider theme={theme}>
      {/* <div id="overlays" />
			<div id="modal-root" /> */}
      {isLoggedIn && <Navbar />}
      <main>{children}</main>
    </ThemeProvider>
  );
}
