import React from "react";
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

const locations = [{ label: "torino" }, { label: "milano" }, { label: "roma" }];

function CloseSalon(props) {
  const router = useRouter();
  const query = router.query;
  console.log({ query, router });
  const [startDate, setStartDate] = React.useState<Dayjs | null>(
    dayjs("2022-04-17")
  );
  const [endDate, setEndDate] = React.useState<Dayjs | null>(
    dayjs("2022-04-17")
  );

  const onSubmit = () => {
    console.log("submit!");
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
            options={locations}
            renderInput={(params) => <TextField {...params} label="Salon" />}
            sx={{ width: 400 }}
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
              label="Start date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="End date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
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
