import React, { useState, useContext, useEffect, useMemo } from "react";
import Head from "next/head";
import {
  DateCalendar,
  DayCalendarSkeleton,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import _reduce from "lodash/reduce";
import _uniq from "lodash/uniq";
import _isEmpty from "lodash/isEmpty";
import {
  Badge,
  Drawer,
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { AppContext, PopUpContext } from "@utils/index";
import { useRouter } from "next/router";

const TODAY = dayjs();

const DayDetails = ({ bookingsData }) => {
  if (bookingsData.length < 1) {
    return <Typography sx={{ width: 450 }}>No bookings yet</Typography>;
  }

  return (
    <Box sx={{ width: 450 }} role="presentation">
      {bookingsData.map(
        (
          { user, booking_date, service_type, staff_name, staff_surname },
          i: number
        ) => {
          return (
            <Accordion key={`list-el-${i}`}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Client: {user.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>UserName: {user.userName}</Typography>
                <Typography>
                  {booking_date.format("HH:mm")} - {service_type} - Staff:{" "}
                  {staff_name} {staff_surname}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        }
      )}
    </Box>
  );
};

function ServerDay(
  props: PickersDayProps<Dayjs> & {
    highlightedDays?: number[];
    datePicked?: Dayjs | boolean;
    setDatePicked?: React.Dispatch<React.SetStateAction<boolean | dayjs.Dayjs>>;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    toggleDrawer?: (event: any) => void;
    // showDaysOutsideCurrentMonth?: boolean;
  }
) {
  const {
    highlightedDays = [],
    day,
    setIsOpen = () => {},
    toggleDrawer = () => {},
    datePicked = false,
    setDatePicked = () => {},
    // showDaysOutsideCurrentMonth = false,
    outsideCurrentMonth,
    ...other
  } = props;

  const isSelected = React.useMemo(
    () =>
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0,
    [highlightedDays]
  );

  const handleClick = (e) => {
    toggleDrawer(e);
    setDatePicked(day);
  };

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🌚" : undefined} //"🔅"
    >
      <PickersDay
        {...other}
        onClick={handleClick}
        outsideCurrentMonth={props.outsideCurrentMonth}
        // showDaysOutsideCurrentMonth={true}
        day={day}
        // sx={{ width: "55px" }}
        {...other}
      />
    </Badge>
  );
}

function Bookings(props) {
  // const { responseLocData, responseCalData, selectedLoc, calendar } = props; // from serversideprops
  const router = useRouter();
  console.log({ router, p: router.asPath });
  const locId = parseInt(router.asPath.split("?")[1].split("=")[1]);
  const { showPopUp } = useContext(PopUpContext);
  const { locations, getCalendar } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(true);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [datePicked, setDatePicked] = useState<Dayjs | boolean>(false);

  const [calendar, setCalendar] = useState([]);

  const selectedLoc = useMemo(() => {
    console.log({ locId });
    const selLocation = locations.find((loc) => loc.id_location == locId);
    if (selLocation) {
      getCalendar(selLocation.id_location)
        .then((data) => {
          setCalendar(data);
        })
        .catch((err) => console.log({ err }));
      // const calendar = await getCalendar(selLocation.id_location);
      // setCalendar(calendar);
    }
    return selLocation;
  }, [router, locations]);

  const bookingData = useMemo(() => {
    if (!_isEmpty(calendar)) {
      return _reduce(
        calendar,
        (acc, val, key) => {
          val = val.map((b) => ({
            ...b,
            booking_date: dayjs(b.booking_date),
          }));
          acc[key] = val;
          return acc;
        },
        {}
      );
    }
    return {};
  }, [calendar]);

  console.log({ calendar, bookingData });
  const fetchHighlightedDays = React.useCallback(
    (newMonth: string) => {
      setIsLoading(true);
      if (!_isEmpty(bookingData) && bookingData[newMonth]) {
        const highDays = _uniq(
          bookingData[newMonth].map((booking: { booking_date: Dayjs }) =>
            parseInt(booking.booking_date.format("DD"))
          )
        );
        setHighlightedDays(highDays);
      } else {
        setHighlightedDays([]);
      }
      setIsLoading(false);
    },
    [selectedLoc, bookingData]
  );

  useEffect(() => {
    // if (calendar && responseLocData.error) {
    //   return showPopUp({ title: "Error", content: responseLocData.message });
    // } else if (responseCalData && responseCalData.error) {
    //   return showPopUp({ title: "Error", content: responseCalData.message });
    // }
    fetchHighlightedDays(TODAY.format("MM-YYYY"));
  }, [bookingData]);

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <Head>
        <title>Locks&Layers</title>
        <meta name="description" content="Locks&Layers bookings schedule" />
      </Head>
      <h1>Bookings</h1>

      <Container sx={{ width: "600px", height: "1000px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            showDaysOutsideCurrentMonth={false}
            defaultValue={TODAY}
            loading={isLoading}
            onMonthChange={(newDate) =>
              fetchHighlightedDays(newDate.format("MM-YYYY"))
            }
            views={["day"]}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{ day: ServerDay }}
            slotProps={{
              day: {
                highlightedDays,
                setIsOpen,
                toggleDrawer,
                datePicked: datePicked,
                setDatePicked: setDatePicked,
                showDaysOutsideCurrentMonth: false,
              } as any,
            }}
            sx={{
              maxHeight: "1000px !important",
              minWidth: "600px",
              ".MuiPickersCalendarHeader-root": {
                /** month and navigation buttons */
              },

              ".MuiDayCalendar-header": {
                /** week days initials */
                justifyContent: "space-evenly",
              },

              ".MuiPickersFadeTransitionGroup-root.MuiDateCalendar-viewTransitionContainer":
                {
                  ".MuiTypography-root.MuiTypography-caption.MuiDayCalendar-weekDayLabel":
                    {
                      fontSize: "1.75rem",
                      height: "80px",
                    },
                  ".MuiPickersSlideTransition-root": {
                    /** days - numbers */
                    width: "100%",
                    height: "420px",
                    ".MuiDayCalendar-monthContainer": {
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      ".MuiDayCalendar-weekContainer": {
                        justifyContent: "space-evenly",
                      },
                      ".MuiBadge-root": {
                        /* single day */

                        ".MuiButtonBase-root.MuiPickersDay-root": {
                          /** text */
                          fontSize: "1.75rem",
                        },
                      },
                    },
                  },
                },
            }}
          />
        </LocalizationProvider>
      </Container>
      <div>
        <Drawer anchor={"right"} open={isOpen} onClose={toggleDrawer}>
          <DayDetails
            bookingsData={
              dayjs.isDayjs(datePicked)
                ? bookingData[datePicked.format("MM-YYYY")].filter(
                    ({ booking_date }) => datePicked.isSame(booking_date, "day")
                  )
                : []
            }
          />
        </Drawer>
      </div>
    </div>
  );
}

export default Bookings;

// Handle token in request cookie to authorize server side GET requests

// export async function getServerSideProps({ query, req }) {
//   const cookies = req.cookies;
//   console.log({ cookies });
//   const responseLoc = await fetch("http://localhost:8080/admin/locations", {
//     method: "GET",
//   });
//   const responseLocData = await responseLoc.json();

//   const selectedLoc = responseLocData.locations.find(
//     (loc) => loc.city.toLowerCase() === query.loc
//   );

//   if (!responseLocData.error) {
//     const response = await fetch(
//       `http://localhost:8080/bookings/calendar?locationId=${selectedLoc.id_location}`,
//       { method: "GET" }
//     );
//     const responseCalData = await response.json();

//     if (!responseCalData.error) {
//       const data = responseCalData.bookingData;

//       return { props: { calendar: data, selectedLoc } };
//     } else return { props: { responseCalData, calendar: {}, selectedLoc: {} } };
//   }
//   return { props: { responseLocData, calendar: {}, selectedLoc: {} } };
// }
