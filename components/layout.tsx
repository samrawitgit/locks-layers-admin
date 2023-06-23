import { createTheme, ThemeProvider } from "@mui/material/styles";

import Navbar from "./Navbar/Navbar";

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
  return (
    <ThemeProvider theme={theme}>
      {/* <div id="overlays" />
			<div id="modal-root" /> */}
      <Navbar />
      <main>{children}</main>
    </ThemeProvider>
  );
}
