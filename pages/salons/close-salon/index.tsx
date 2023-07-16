import React, { useMemo, useContext, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  FormLabel,
  FormGroup,
  Autocomplete,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AppContext } from "@utils/containers/app.container";
import { useHttpClient } from "@utils/hooks/httpClient";
import { PopUpContext } from "@utils/containers/pop-up.container";

function CloseSalon(props) {
  const router = useRouter();
  const { locations } = useContext(AppContext);
  const { sendRequest } = useHttpClient();
  const { showPopUp } = useContext(PopUpContext);

  const [salon, setSalon] = useState(null);
  const [formError, setFormError] = useState({
    salon: false,
    startDate: false,
    endDate: false,
  });
  const today = dayjs();

  const location = useMemo(() => {
    const selLocation = locations.find(
      (loc) => loc.city.toLowerCase() == router.query.loc
    );
    if (selLocation) setSalon(selLocation.city);
    return selLocation;
  }, [locations, router]);

  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    today.add(1, "day")
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(
    today.add(2, "day")
  );

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
      "http://localhost:8080/admin/close-location",
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
      },
      {
        "Content-Type": "application/json",
      }
    );
    // console.log({ closeLocRes });
    if (closeLocRes.error) {
      showPopUp({ title: "Error", content: closeLocRes.message });
    }
  };

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
          component="h2"
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
            options={locations.map((loc) => loc.city)}
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
              minDate={today.add(1, "day")}
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
