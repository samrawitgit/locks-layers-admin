import React from "react";
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

const LocationDetails = (props) => {
  const router = useRouter();
  const salonLocation = router.query.loc;
  console.log({ query: router.query, router });
  const selectedSalonData = React.useMemo(() => {
    return salonData.find((salon) => salon.location == salonLocation);
  }, [salonLocation]);

  // TODO: useEffect to fetch location data maybe add getProps

  if (!selectedSalonData) {
    return <Typography>No data available</Typography>;
  }

  return (
    <>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", my: 6, textTransform: "capitalize" }}
      >
        {selectedSalonData.location}
      </Typography>
      <Grid container spacing={4} rowSpacing={4}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Card sx={{ textAlign: "center" }}>
              <CardHeader title="Address" />
              <CardContent>
                <Typography>{selectedSalonData.address}</Typography>
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
                    {commonData.services.map(({ id, duration, icon }, i) => (
                      <TableRow key={`service-${i}`}>
                        <TableCell align="center" sx={{}}>
                          {icon} {id}
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
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day, i) => (
                    <TableRow key={`schedule-el-${i}`}>
                      <TableCell align="left">{day}</TableCell>
                      <TableCell>09:00</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>18:00</TableCell>
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
                {selectedSalonData.staffMembers.map((staff, i) => (
                  <Typography key={`staff-member-${i}`}>{staff}</Typography>
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
