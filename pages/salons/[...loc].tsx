import React, { useMemo } from "react";
import { GetServerSideProps } from "next";
import {
  Grid,
  Typography,
  Button,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Stack,
} from "@mui/material";
import WrongLocationOutlinedIcon from "@mui/icons-material/WrongLocationOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import AirOutlinedIcon from "@mui/icons-material/AirOutlined";

import NextLinkComposed from "@components/NextLink/NextLink";
import { withSessionSsr } from "@utils/.";

interface ILocation {
  road: string;
  number: string;
  post_code: string;
  city: string;
  country: string;
  id_location: number;
  image_url: string;
  business_hours: any[];
}

const LocationDetails = (props) => {
  const { location, services } = props;

  const services_ = useMemo(() => {
    if (!services) return;
    const services_ = services.map((s, i) => {
      let icon;
      switch (s.service_type) {
        case "trim":
          icon = (
            <ContentCutOutlinedIcon
              sx={{ marginRight: "15px", marginBottom: "-7px" }}
            />
          );
          break;
        case "perm":
          icon = (
            <AirOutlinedIcon
              sx={{ marginRight: "15px", marginBottom: "-7px" }}
            />
          );
          break;
        case "color":
          icon = (
            <PaletteOutlinedIcon
              sx={{ marginRight: "15px", marginBottom: "-7px" }}
            />
          );
          break;
        default:
          break;
      }
      return {
        type: s.service_type,
        duration: s.duration.slice(0, 5) + " h",
        icon,
      };
    });
    return services_;
  }, [services]);

  if (
    !location ||
    Object.keys(location).length < 1 ||
    !services ||
    services.length < 1
  ) {
    return <Typography>No data available</Typography>;
  }

  return (
    <>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", my: 6, textTransform: "capitalize" }}
      >
        {location.city}
      </Typography>
      <Grid container spacing={4} rowSpacing={4}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Card sx={{ textAlign: "center" }}>
              <CardHeader title="Address" />
              <CardContent>
                <Typography>
                  {location.road}, {location.number}, {location.post_code}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ textAlign: "center" }}>
              <CardHeader title="Services" />
              <CardContent sx={{ px: "15%" }}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Service</TableCell>
                      <TableCell align="center">Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {services_.map(({ type, duration, icon }, i) => (
                      <TableRow key={`service-${i}`}>
                        <TableCell align="center" sx={{}}>
                          {icon} {type}
                        </TableCell>
                        <TableCell align="center">{duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ textAlign: "center" }}>
            <CardHeader title="Timetable" />
            <CardContent>
              <Table aria-label="simple table">
                <TableBody>
                  {location.business_hours.map((day, i) => (
                    <TableRow key={`schedule-el-${i}`}>
                      <TableCell align="left">{day.day_week}</TableCell>
                      <TableCell align="center">
                        {day.closed ? "" : day.opening_time}
                      </TableCell>
                      <TableCell align="center">
                        {day.closed ? "Closed" : "-"}
                      </TableCell>
                      <TableCell align="center">
                        {day.closed ? "" : day.closing_time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ textAlign: "center" }}>
            <CardHeader title="Staff Members" />
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem />}
                justifyContent="center"
              >
                {location.staff.map((staff, i) => (
                  <Typography key={`staff-member-${i}`}>
                    {staff.name}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="center"
        sx={{ textAlign: "center", mt: 6, mb: 9 }}
      >
        <Grid item xs={4}>
          <Button
            component={NextLinkComposed}
            to={{
              pathname: "/salons/close-salon",
              query: { locId: location.id_location },
            }}
            variant="contained"
            endIcon={<WrongLocationOutlinedIcon />}
            size="large"
          >
            Close location
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            component={NextLinkComposed}
            to={{
              pathname: "/salons/bookings",
              query: { locId: location.id_location },
            }}
            variant="contained"
            endIcon={<CalendarMonthOutlinedIcon />}
            size="large"
          >
            Bookings
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default LocationDetails;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, query }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const locRes = await fetch(`${process.env.backend_url}/admin/locations`, {
      method: "GET",
      body: null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const locResData = await locRes.json();

    if (locResData && locResData.locations.length) {
      const selectedLoc = locResData.locations.find(
        (loc) => loc.id_location.toString() === query.locId
      );
      if (selectedLoc) {
        const parseBh = selectedLoc.business_hours.map((day) => {
          if (day.opening_time && day.closing_time) {
            return {
              ...day,
              opening_time: day.opening_time.slice(0, 5),
              closing_time: day.closing_time.slice(0, 5),
            };
          }
          return day;
        });
        const location = {
          ...selectedLoc,
          business_hours: parseBh,
        };

        const servRes = await fetch("http://localhost:8080/admin/services", {
          method: "GET",
          body: null,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const servResData = await servRes.json();

        if (servResData && servResData.services.length) {
          return {
            props: {
              location,
              services: servResData.services,
              isLoggedIn: !!user,
            },
          };
        }
      }
      return { props: { location: null, services: [], isLoggedIn: !!user } };
    } else {
      return { props: { location: null, services: [], isLoggedIn: !!user } };
    }
  }
);
