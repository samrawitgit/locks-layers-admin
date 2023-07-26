import React, { useContext } from "react";
import { useRouter } from "next/router";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import {
  MUIImage,
  ImageBackdrop,
  ImageButton,
  ImageMarked,
  ImageSrc,
} from "./StyledSalon";
import { GetServerSideProps } from "next";

const ButtonBases = (props) => {
  const { locationData } = props;
  const { city, image_url, id_location } = locationData;
  const router = useRouter();
  const onClick = () => {
    router.push({ pathname: `/salons/${city}`, query: { locId: id_location } });
  };

  // console.log({ locationData });
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
  console.log({ locations });

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

// export async function getServerSideProps(context) {
//   const response = await fetch("http://localhost:8080/admin/locations", {
//     method: "GET",
//   });
//   const responseData = await response.json();
//   console.log({ responseData });

//   if (responseData && responseData.locations.length) {
//     return {
//       props: { locations: responseData.locations },
//     };
//   } else {
//     return { props: null };
//   }
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Grabs the authentication cookie from the HTTP request
  const accessToken = context.req.cookies["SID"];
  console.log({ accessToken });

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

  const response = await fetch("http://localhost:8080/admin/locations", {
    method: "GET",
    body: null,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const responseData = await response.json();
  console.log({ response });

  // Send isLoggedIn for navbar settings
  if (responseData && responseData.locations.length) {
    return {
      props: { locations: responseData.locations, isLoggedIn: !!accessToken },
    };
  } else {
    return { props: null, isLoggedIn: !!accessToken };
  }
};
