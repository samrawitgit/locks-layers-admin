import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";

const StyledNavbar = styled(AppBar)(({ theme }) => ({
  position: "static",

  ".left-logo-label": {
    display: "none",
    marginRight: 32,
  },

  ".menu-list": {
    flexGrow: 1,
    display: "none",
    a: {
      color: "white",
      alignItems: "center",
      display: "block",
    },
  },

  ".logout-btn": {
    marginTop: "16px",
    marginBottom: "16px",
    padding: "12px",
  },

  ".menu-icon": {
    display: "flex",

    "#menu-appbar": {
      display: "block",
    },
  },

  [theme.breakpoints.up("md")]: {
    ".left-logo-label, .menu-list": {
      display: "flex",
    },

    ".center-logo-label, .menu-icon, #menu-appbar": {
      display: "none",
    },

    ".active": {
      backgroundColor: "#ffffff57",
      color: `${theme.palette.secondary.main} !important`,
      fontWeight: "700 !important",
    },
  },
}));

export default StyledNavbar;
