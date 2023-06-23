import React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";

// (  ({ theme }) => `border: 3px solid ${theme.palette.primary.main};`
const StyledNavbar = styled(AppBar)`
  position: static;
  .left-logo-icon {
    display: none;
    margin-right: 8px;
  }

  .left-logo-writing {
    display: none;
    margin-right: 16px;
    font-family: monospace;
    font-weight: 700;
    letter-spacing: 0.3rem;
    color: inherit;
    text-decoration: none;
  }

  .center-logo-label {
    display: flex;
    margin-right: 2;
    flex-grow: 1;
    font-family: monospace;
    font-weight: 700;
    letter-spacing: 0.3rem;
    color: inherit;
    text-decoration: none;
  }

  .menu-list {
    flex-grow: 1;
    display: none;
    a {
      margin-top: 16px;
      margin-bottom: 16px;
      color: white;
      display: block;
    }
  }

  .logout-btn {
    display: block;
    flex-grow: 0;
    margin-top: 16px;
    margin-bottom: 16px;
    padding: 12px;
  }

  .menu-icon {
    display: flex;
    flex-grow: 1;

    #menu-appbar {
      display: block;
    }
  }

  .center-logo-icon {
    display: flex;
    margin-right: 8px;
  }

  @media (min-width: 900px) {
    /*md = medium*/
    .left-logo-icon,
    .left-logo-writing,
    .menu-list {
      display: flex;
    }

    .center-logo-icon,
    .center-logo-label,
    .menu-icon,
    #menu-appbar {
      display: none;
    }
  }

  @media (min-width: 600px) {
    /*sm = small*/
  }

  @media (min-width: 1200px) {
    /*lg = large*/
  }
`;

export default StyledNavbar;
