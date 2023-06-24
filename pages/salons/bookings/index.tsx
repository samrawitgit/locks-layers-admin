import React from "react";
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
import { useRouter } from "next/router";

const initialValue = dayjs("2022-04-17");

const bookings = [
  {
    date: "2022-04-01",
    time: "11.30",
    staff: "Maurizio",
    service: "trim",
    customer: "Jane",
    location: "milano",
  },
  {
    date: "2022-04-01",
    time: "14.24",
    staff: "Pietro",
    service: "perm",
    customer: "Stan",
    location: "milano",
  },
  {
    date: "2022-04-02",
    time: "11.30",
    staff: "Veronica",
    service: "perm",
    customer: "Frank",
    location: "roma",
  },
  {
    date: "2022-04-15",
    time: "11.30",
    staff: "Pietro",
    service: "perm",
    customer: "Louise",
    location: "torino",
  },
  {
    date: "2022-04-30",
    time: "11.30",
    staff: "Giulia",
    service: "dye",
    customer: "Paul",
    location: "roma",
  },
  {
    date: "2022-05-23",
    time: "11.30",
    staff: "Giulia",
    service: "dye",
    customer: "Paul",
    location: "roma",
  },
  {
    date: "2022-05-14",
    time: "11.30",
    staff: "Giulia",
    service: "dye",
    customer: "Paul",
    location: "roma",
  },
];

const DayDetails = ({ datePicked, loc }) => {
  console.log("details", {
    datePicked,
    day: dayjs(datePicked).format("YYYY-MM-DD"),
  });

  const dayData = React.useMemo(() => {
    const selectedDateData =
      bookings.filter(
        (booking) =>
          dayjs(datePicked).format("YYYY-MM-DD") === booking.date &&
          booking.location === loc
      ) || [];
    return selectedDateData;
  }, [datePicked]);

  if (dayData.length < 1) {
    return <Typography sx={{ width: 450 }}>No bookings yet</Typography>;
  }

  return (
    <Box sx={{ width: 450 }} role="presentation">
      {dayData.map((singleBooking, i) => {
        return (
          <Accordion key={`list-el-${i}`}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{singleBooking.customer}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {singleBooking.time} - {singleBooking.service} -{" "}
                {singleBooking.staff}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
{
}

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
  const router = useRouter();
  const { loc } = router.query;
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [datePicked, setDatePicked] = React.useState<Dayjs | boolean>(false);

  // React.useEffect(() => {
  //   fetchHighlightedDays(initialValue);
  //   // abort request on unmount
  //   return () => requestAbortController.current?.abort();
  // }, []);

  const fetchHighlightedDays = React.useCallback((newDate) => {
    setIsLoading(true);
    console.log({ month: newDate.month() });
    const highDays = bookings
      .filter(({ location }) => location === loc)
      .filter(({ date }) => dayjs(date).month() === newDate.month())
      .map((booking) => parseInt(dayjs(booking.date).format("DD")));
    setHighlightedDays(highDays);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchHighlightedDays(initialValue);
  }, []);

  const handleMonthChange = (date: Dayjs) => {
    /*if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }*/

    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    console.log("toggle", { event });
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
            defaultValue={initialValue}
            loading={isLoading}
            onMonthChange={fetchHighlightedDays}
            views={["day"]}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: ServerDay,
            }}
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
          <DayDetails datePicked={datePicked} loc={loc} />
        </Drawer>
      </div>
    </div>
  );
}

export default Bookings;
