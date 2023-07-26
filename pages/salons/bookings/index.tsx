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

import { PopUpContext } from "@utils/index";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

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
  const { calendarData } = props;
  console.log({ calendarData });
  const router = useRouter();
  console.log({ router, p: router.asPath });
  const { showPopUp } = useContext(PopUpContext);

  const [isLoading, setIsLoading] = useState(true);
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [datePicked, setDatePicked] = useState<Dayjs | boolean>(false);

  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    if (calendarData) {
      const bookData = _reduce(
        calendarData,
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
      setCalendar(bookData);
      fetchHighlightedDays(TODAY.format("MM-YYYY"), bookData);
    }
  }, [calendarData]);

  const fetchHighlightedDays = React.useCallback(
    (newMonth: string, bookingData = calendar) => {
      // console.log({ bookingData });
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
    [calendar]
  );

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
                ? calendar[datePicked.format("MM-YYYY")].filter(
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  // Grabs the authentication cookie from the HTTP request
  const accessToken = req.cookies["SID"];

  // Checks if the authentication cookie is set in the request and if it's valid
  // If it isn't, redirects the user to the login page
  if (!accessToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const calendarRes = await fetch(
    `http://localhost:8080/bookings/calendar?locationId=${query.locId}`,
    {
      method: "GET",
      body: null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const calendarResData = await calendarRes.json();
  if (calendarResData && calendarResData.bookingData) {
    console.log({ book: calendarResData.bookingData });
    return {
      props: {
        calendarData: calendarResData.bookingData,
        isLoggedIn: !!accessToken,
      },
    };
  } else {
    return { props: { msg: "No locations data", isLoggedIn: !!accessToken } };
  }
};
