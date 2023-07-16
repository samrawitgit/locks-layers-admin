import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import {
  Grid,
  Typography,
  Paper,
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

import NextLinkComposed from "../../components/NextLink/NextLink";
import { AppContext } from "@utils/containers/app.container";

const commonData = {
  openingTime: "9",
  closingTime: "18",
  services: [
    {
      id: "trim",
      duration: "00:30:00",
      icon: (
        <ContentCutOutlinedIcon
          sx={{ marginRight: "15px", marginBottom: "-7px" }}
        />
      ),
    },
    {
      id: "perm",
      duration: "01:00:00",
      icon: (
        <PaletteOutlinedIcon
          sx={{ marginRight: "15px", marginBottom: "-7px" }}
        />
      ),
    },
    {
      id: "dye",
      duration: "01:30:00",
      icon: (
        <AirOutlinedIcon sx={{ marginRight: "15px", marginBottom: "-7px" }} />
      ),
    },
  ],
};

const salonData = [
  {
    location: "torino",
    address: "Corso Vittorio Emanuele II, 98, 10121",
    startWeekDay: "tuesday",
    endWeekDay: "saturday",
    staffMembers: ["Laura1", "Laura2"],
  },
  {
    location: "milano",
    address: "Via Adda, 5, 20124",
    startWeekDay: "tuesday",
    endWeekDay: "sunday",
    staffMembers: ["Fabio1", "Fabio2", "Fabio3", "Fabio4", "Fabio5"],
  },
  {
    location: "roma",
    address: "Via Dandolo, 25, 00153",
    startWeekDay: "tuesday",
    endWeekDay: "saturday",
    staffMembers: ["Giulia1", "Giulia2", "Giulia3", "Giulia4"],
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
  const router = useRouter();
  const salonLocation = router.query.loc;
  const { locations, services } = useContext(AppContext);

  const location = useMemo(() => {
    const selLocation = locations.find(
      (loc) => loc.city.toLowerCase() == salonLocation[0]
    );
    if (selLocation) {
      const parseBh = selLocation.business_hours.map((day) => {
        if (day.opening_time && day.closing_time) {
          return {
            ...day,
            opening_time: day.opening_time.slice(0, 5),
            closing_time: day.closing_time.slice(0, 5),
          };
        }
        return day;
      });
      return {
        ...selLocation,
        business_hours: parseBh,
      };
    }
  }, [router]);

  const services_ = useMemo(() => {
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

  if (!locations.length || !location) {
    return <Typography>No data available</Typography>;
  }

  console.log({ location, services, services_ });

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
              query: { loc: salonLocation },
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
              query: { loc: salonLocation },
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
