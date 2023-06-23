import React from "react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";

const LocationDetails = (props) => {
  const router = useRouter();
  const salonLocation = router.query.loc;

  // TODO: useEffect to fetch location data maybe add get props

  return (
    <>
      <Typography variant="h3">Location: {salonLocation}</Typography>
    </>
  );
};

export default LocationDetails;
