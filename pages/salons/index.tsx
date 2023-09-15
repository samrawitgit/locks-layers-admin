import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {
  MUIImage,
  ImageBackdrop,
  ImageButton,
  ImageMarked,
  ImageSrc,
} from "../../public/css/StyledSalon";
import { withSessionSsr } from "@utils/.";

const ButtonBases = (props) => {
  const { locationData } = props;
  const { city, image_url, id_location } = locationData;
  const router = useRouter();
  const onClick = () => {
    router.push({ pathname: `/salons/${city}`, query: { locId: id_location } });
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
      <MUIImage>
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
      </MUIImage>
    </ImageButton>
  );
};

function Salons(props) {
  const { locations } = props;

  if (!locations) {
    return <Typography>No data available</Typography>;
  }

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
        <Grid item xs={12} md={4} key={`loc-el-${i}`}>
          <ButtonBases locationData={locationData} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Salons;

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const response = await fetch(`${process.env.backend_url}/admin/locations`, {
      method: "GET",
      body: null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const responseData = await response.json();

    if (
      responseData &&
      responseData.locations &&
      responseData.locations.length
    ) {
      return {
        props: { locations: responseData.locations, isLoggedIn: !!user },
      };
    } else {
      return { props: { isLoggedIn: !!user, locations: [] } };
    }
  }
);
