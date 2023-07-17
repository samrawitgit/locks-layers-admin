import React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";

const StyledNavbar = styled(AppBar)(({ theme }) => ({
  position: "static",
  ".left-logo-icon": {
    display: "none",
    marginRight: "8px",
  },

  ".left-logo-writing": {
    display: "none",
    marginRight: "16px",
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: "0.3rem",
    color: "inherit",
    textDecoration: "none",
  },

  ".center-logo-label": {
    display: "flex",
    marginRight: 2,
    flexGrow: 1,
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: "0.3rem",
    color: "inherit",
    textDecoration: "none",
  },

  ".menu-list": {
    flexGrow: 1,
    display: "none",
    a: {
      marginTop: "16px",
      marginBottom: "16px",
      color: "white",
      display: "block",
    },
  },

  ".logoutBtn": {
    display: "block",
    flexGrow: 0,
    marginTop: "16px",
    marginBottom: "16px",
    padding: "12px",
  },

  ".menu-icon": {
    display: "flex",
    flexGrow: 1,

    "#menu-appbar": {
      display: "block",
    },
  },

  ".center-logo-icon": {
    display: "flex",
    marginRight: "8px",
  },

  [theme.breakpoints.up("md")]: {
    ".left-logo-icon, .left-logo-writing, .menu-list": {
      display: "flex",
    },

    ".center-logo-icon, .center-logo-label, .menu-icon, #menu-appbar": {
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
