import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import { useRouter } from "next/router";

import NextLinkComposed from "../../components/NextLink/NextLink";
import { AppContext } from "@utils/containers/app.container";

import StyledNavbar from "./StyledNavbar";

const pages = [
  { title: "Salons", route: "/salons" },
  { title: "Staff", route: "/time-off" },
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AppContext);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  return (
    <StyledNavbar className="navbar">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ContentCutIcon className="left-logo-icon" />
          <Typography
            className="left-logo-writing"
            variant="h6"
            noWrap
            component="a"
            href="/"
          >
            Locks&Layerss
          </Typography>

          <Box
            className="menu-icon"
            sx={{
              flexGrow: 1,
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map(({ title, route }, i) => (
                <Button
                  component={NextLinkComposed}
                  key={`nav-el-${i}`}
                  to={route}
                  onClick={handleCloseNavMenu}
                  sx={{
                    md: "none",
                    display: "block",
                  }}
                  className={route === router.pathname ? "active " : ""}
                >
                  {title}
                </Button>
              ))}
            </Menu>
          </Box>

          <ContentCutIcon className="center-logo-icon" />
          <Typography
            className="center-logo-label"
            variant="h5"
            noWrap
            component="a"
            href=""
          >
            Lock&Layers
          </Typography>
          <Box className="menu-list">
            {pages.map(({ title, route }, i) => (
              <Button
                component={NextLinkComposed}
                key={`nav-el-${i}`}
                to={route}
                onClick={handleCloseNavMenu}
                className={route === router.pathname ? "active " : ""}
              >
                <Typography textAlign="center">{title}</Typography>
              </Button>
            ))}
          </Box>
          <Button
            className="logout-btn"
            variant="outlined"
            color="secondary"
            onClick={logout}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </StyledNavbar>
  );
}
export default Navbar;
