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
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const locationsOld = ["torino", "milano", "roma"];

const locations = [
  { location: "torino", team: ["Laura1", "Laura2"] },
  {
    location: "milano",
    team: ["Fabio1", "Fabio2", "Fabio3", "Fabio4", "Fabio5"],
  },
  { location: "roma", team: ["Giulia1", "Giulia2", "Giulia3", "Giulia4"] },
];

const TimeRangeComponent = (props) => {
  const {
    startShiftValue,
    setStartShiftValue,
    endShiftValue,
    setEndShiftValue,
    disabled,
    type,
  } = props;

  // shift
  if (type === "shift") {
    return (
      <>
        <DatePicker
          label="Date"
          value={startShiftValue}
          onChange={(newValue) => setStartShiftValue(newValue.set("hour", 8))}
          disabled={disabled}
          sx={{ mb: 2 }}
        />
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ width: 400 }}
        >
          <TimePicker
            label="From"
            value={startShiftValue}
            onChange={(newValue) => setStartShiftValue(newValue)}
            views={["hours"]}
            disabled={disabled}
            format="HH"
            ampm={false}
            minTime={dayjs(startShiftValue).hour(9)}
            maxTime={dayjs(startShiftValue).hour(17)} // 1h before closing
          />
          <TimePicker
            label="To"
            value={endShiftValue}
            onChange={(newValue) => setEndShiftValue(newValue)}
            views={["hours"]}
            disabled={disabled}
            format="HH"
            ampm={false}
            minTime={
              dayjs(startShiftValue).add(1, "hour") ||
              dayjs(startShiftValue).hour(10)
            } // 1 h after opening or selected start time
            maxTime={dayjs(startShiftValue).hour(18)}
          />
        </Stack>
      </>
    );
  }
  //  day
  if (type === "single-day") {
    return (
      <DatePicker
        label="Date"
        value={endShiftValue}
        onChange={(newValue) => {
          setStartShiftValue(newValue.set("hour", 9));
          setEndShiftValue(newValue.set("hour", 18));
        }}
        disabled={disabled}
      />
    );
  }
  //  multiple days
  if (type === "multiple-days") {
    return (
      <Stack
        direction="row"
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ width: 400 }}
      >
        <DatePicker
          label="From"
          value={startShiftValue}
          onChange={(newValue) => setStartShiftValue(newValue.set("hour", 9))}
          disabled={disabled}
        />
        <DatePicker
          label="To"
          value={endShiftValue}
          onChange={(newValue) => setEndShiftValue(newValue.set("hour", 18))}
          disabled={disabled}
        />
      </Stack>
    );
  }
};

function TimeOff(props) {
  const router = useRouter();
  const query = router.query;

  const [locationValue, setLocationValue] = React.useState<string | null>(null);
  const [staffValue, setStaffValue] = React.useState<string | null>(null);
  const [staffOptions, setStaffOptions] = React.useState<string[]>([]);
  const [typeValue, setTypeValue] = React.useState<string | null>(null);
  const [startShiftValue, setStartShiftValue] = React.useState<Dayjs | null>(); // maybe today
  const [endShiftValue, setEndShiftValue] = React.useState<Dayjs | null>();

  const onSubmit = () => {
    console.log("submit!");
  };

  return (
    <div>
      <Head>
        <title>Locks&Layers</title>
        <meta
          name="description"
          content="Locks&Layers staff time off request form"
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
          STAFF TIME-OFF REQUEST FORM
        </FormLabel>
        <FormGroup
          sx={{
            height: "550px",
            display: "flex",
            alignContent: "center",
            justifyContent: "space-evenly",
          }}
        >
          {/** TODO: use Stack MUI */}
          {/** Location */}
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={locationsOld}
            renderInput={(params) => <TextField {...params} label="Salon" />}
            value={locationValue}
            onChange={(event: any, newValue: string | null) => {
              setLocationValue(newValue);
              setStaffOptions(() => {
                const data = locations.find(
                  (locData) => locData.location === newValue
                );
                return data ? data.team : [];
              });
              setStaffValue(null);
              setTypeValue(null);
              setStartShiftValue(null);
              setEndShiftValue(null);
            }}
            sx={{ width: 400 }}
          />
          {/** Staff */}
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={staffOptions}
            renderInput={(params) => (
              <TextField {...params} label="Staff member" />
            )}
            sx={{ width: 400 }}
            value={staffValue}
            onChange={(event: any, newValue: string | null) => {
              setStaffValue(newValue);
              setTypeValue(null);
              setStartShiftValue(null);
              setEndShiftValue(null);
            }}
            disabled={staffOptions.length < 1}
          />
          {/** Type */}
          <FormControl disabled={!staffValue}>
            <FormLabel id="demo-radio-buttons-group-label">Type</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={typeValue}
              onChange={(event: any, newValue: string | null) => {
                setTypeValue(newValue);
                setStartShiftValue(null);
                setEndShiftValue(null);
              }}
            >
              <FormControlLabel
                value="shift"
                control={<Radio />}
                label="Shift"
              />
              <FormControlLabel
                value="single-day"
                control={<Radio />}
                label="1 Day"
              />
              <FormControlLabel
                value="multiple-days"
                control={<Radio />}
                label="Multiple Days"
              />
            </RadioGroup>
          </FormControl>
          {/** Calendars */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl
              component={() => (
                <TimeRangeComponent
                  startShiftValue={startShiftValue}
                  setStartShiftValue={setStartShiftValue}
                  endShiftValue={endShiftValue}
                  setEndShiftValue={setEndShiftValue}
                  disabled={!typeValue}
                  type={typeValue}
                />
              )}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 3, width: "150px", py: "10px", mx: "auto" }}
            onClick={onSubmit}
            disabled={!startShiftValue || !endShiftValue}
          >
            Submit
          </Button>
        </FormGroup>
      </Paper>
    </div>
  );
}

export default TimeOff;
