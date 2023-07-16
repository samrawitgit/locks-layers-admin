import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {
  Image,
  ImageBackdrop,
  ImageButton,
  ImageMarked,
  ImageSrc,
} from "./StyledSalon";

const ButtonBases = (props) => {
  const { locationData } = props;
  const { city, image_url } = locationData;
  const router = useRouter();
  const onClick = () => {
    router.push(`/salons/${city.toLowerCase()}`);
  };
  return (
    <ImageButton
      onClick={onClick}
      focusRipple
      style={{
        width: "100%",
      }}
    >
      <ImageSrc style={{ backgroundImage: `url(${image_url})` }} />
      <ImageBackdrop className="MuiImageBackdrop-root" />
      <Image>
        <Typography
          component="span"
          variant="subtitle1"
          color="inherit"
          sx={{
            position: "relative",
            p: 4,
            pt: 2,
            pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
            fontSize: "1.5rem",
          }}
        >
          {city}
          <ImageMarked className="MuiImageMarked-root" />
        </Typography>
      </Image>
    </ImageButton>
  );
};

function Salons(props) {
  const { locations } = props;

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      sx={{
        height: "calc(100vh - 100px)",
      }}
    >
      {locations.map((locationData, i) => (
        <Grid item xs={4} key={`loc-el-${i}`}>
          <ButtonBases locationData={locationData} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Salons;

export async function getServerSideProps(context) {
  const response = await fetch("http://localhost:8080/admin/locations", {
    method: "GET",
  });
  const responseData = await response.json();
  console.log({ responseData });

  if (responseData.data && responseData.data.locations.length) {
    return {
      props: { locations: responseData.data.locations },
    };
  } else {
    return <Typography>No data available</Typography>;
  }
}
