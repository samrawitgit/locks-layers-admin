import React, { useContext, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import dayjs, { Dayjs } from "dayjs";
import {
  FormLabel,
  FormGroup,
  Autocomplete,
  TextField,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useHttpClient, PopUpContext, withSessionSsr } from "@utils/.";

const TODAY = dayjs();

function CloseSalon(props) {
  const { location, allLocations, token } = props;
  const router = useRouter();
  const { sendRequest } = useHttpClient();
  const { showPopUp } = useContext(PopUpContext);

  const [salon, setSalon] = useState(null);
  const [formError, setFormError] = useState({
    salon: false,
    startDate: false,
    endDate: false,
  });

  useEffect(() => {
    if (location && location.city) {
      setSalon(location.city);
    }
  }, []);

  const [reason, setReason] = useState("");

  const [startDate, setStartDate] = useState<Dayjs | null>(TODAY.add(1, "day"));
  const [endDate, setEndDate] = useState<Dayjs | null>(TODAY.add(2, "day"));

  const onSubmit = async () => {
    console.log("submit!");
    if (!salon || !startDate || !endDate) {
      setFormError({
        salon: !Boolean(salon),
        startDate: !Boolean(startDate),
        endDate: !Boolean(endDate),
      });
      return;
    }
    const closeLocRes = await sendRequest(
      `${process.env.backend_url}/admin/close-location`,
      "POST",
      {
        locationId: location.id_location,
        start_date: startDate
          .set("hour", 9)
          .set("minute", 0)
          .set("second", 0)
          .format("YYYY-MM-DD HH:mm:ss"),
        end_date: endDate
          .set("hour", 18)
          .set("minute", 0)
          .set("second", 0)
          .format("YYYY-MM-DD HH:mm:ss"),
        reason,
      },
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
    showPopUp({
      title: closeLocRes.error ? "Error" : "Success!",
      content: closeLocRes.message,
      onClose: () => (closeLocRes.error ? {} : router.push("/salons")),
    });
    if (!closeLocRes.error) {
      setReason("");
    }
    setStartDate(null);
    setEndDate(null);
  };

  if (!allLocations || !location || !token) {
    return <Typography>No data available</Typography>;
  }

  return (
    <div>
      <Head>
        <title>Locks&Layers</title>
        <meta
          name="description"
          content="Locks&Layers closing salon request form"
        />
      </Head>
      <Paper variant="outlined" sx={{ mt: 3, px: 10, py: 5, m: 10 }}>
        <FormLabel
          component="h3"
          sx={{
            w: "100%",
            fontSize: "25px",
            textAlign: "center",
          }}
        >
          CLOSING SALON REQUEST FORM
        </FormLabel>
        <FormGroup
          sx={{
            height: "450px",
            display: "flex",
            alignContent: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={allLocations.map((loc) => loc.city)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Salon"
                required
                error={formError.salon}
              />
            )}
            sx={{ width: 400 }}
            defaultValue={location ? location.city : null}
            value={salon}
            onChange={(event, newValue) => {
              setFormError((prev) => ({ ...prev, salon: false }));
              setSalon(newValue);
            }}
          />
          <TextField
            id="outlined-multiline-flexible"
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={2}
            sx={{ width: 400 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start date *"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              disablePast
              minDate={TODAY.add(1, "day")}
            />
            <DatePicker
              label="End date *"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              disablePast
              minDate={startDate}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 3, width: "150px", py: "10px", mx: "auto" }}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </FormGroup>
      </Paper>
    </div>
  );
}

export default CloseSalon;

interface IGET {
  isLoggedIn: boolean;
  location?: any;
  allLocations?: any;
  token?: any;
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req, query }) {
    const user = req.session.user;

    // Checks if the authentication cookie is set in the request and if it's valid
    // If it isn't, redirects the user to the login page
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
    console.log({ locRes });

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

        return {
          props: {
            location: location,
            allLocations: locResData.locations,
            token: user.token,
            isLoggedIn: !!user,
          },
        };
      }
    } else {
      return {
        props: {
          isLoggedIn: !!user,
        },
      };
    }
  }
);
