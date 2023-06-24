import React from "react";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import { Grid, Typography, Paper, Button } from "@mui/material";
import WrongLocationOutlinedIcon from "@mui/icons-material/WrongLocationOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import NextLinkComposed from "../../components/NextLink/NextLink";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const LocationDetails = (props) => {
  const router = useRouter();
  const salonLocation = router.query.loc;
  console.log({ query: router.query, router });

  // TODO: useEffect to fetch location data maybe add getProps

  return (
    <>
      <Typography variant="h3">Location: {salonLocation}</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Item>Address</Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>Timetable</Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>Services</Item>
        </Grid>
        <Grid item xs={12}>
          <Item>Staff</Item>
        </Grid>
      </Grid>
      <Button
        component={NextLinkComposed}
        to={{
          pathname: "/salons/close-salon",
          query: { loc: salonLocation },
        }}
        variant="contained"
        endIcon={<WrongLocationOutlinedIcon />}
        size="large"
      >
        Close location
      </Button>
      <Button
        component={NextLinkComposed}
        to={{
          pathname: "/salons/bookings",
          query: { loc: salonLocation },
        }}
        variant="contained"
        endIcon={<CalendarMonthOutlinedIcon />}
        size="large"
      >
        Bookings
      </Button>
    </>
  );
};

export default LocationDetails;
