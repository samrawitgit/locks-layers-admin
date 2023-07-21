import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/router";

import { AppContext } from "@utils/containers/app.container";
import NextLinkComposed from "../../components/NextLink/NextLink";
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
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.replace("/login");
  };

  return (
    <StyledNavbar className="navbar">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          className="toolbar"
          style={{
            justifyContent: "space-between",
          }}
        >
          <Button
            component={NextLinkComposed}
            key={`left-logo`}
            to="/"
            className="left-logo-label"
          >
            <Image
              src={"/logos/logo-no-background.png"}
              alt="Locks&Layerss"
              width={150}
              height={40}
            />
          </Button>
          <Box className="menu-icon">
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

          <NextLinkComposed to="/">
            <Image
              className="center-logo-label"
              src={"/logos/logo-no-background.png"}
              alt="Locks&Layerss"
              width={200}
              height={50}
            />
          </NextLinkComposed>
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
