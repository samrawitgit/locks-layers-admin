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

const images = [
  // TODO: from backend
  {
    url: "/locations/torino.jpg",
    title: "torino",
    width: "33%",
  },
  {
    url: "/locations/milano.jpg",
    title: "milano",
    width: "33%",
  },
  {
    url: "/locations/roma.jpg",
    title: "roma",
    width: "33%",
  },
];

const ButtonBases = (props) => {
  const { image } = props;
  const router = useRouter();
  const onClick = () => {
    router.push(`/salons/${image.title}`);
  };
  return (
    <ImageButton
      onClick={onClick}
      focusRipple
      style={{
        width: "100%",
      }}
    >
      <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
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
            textTransform: "capitalize",
            fontSize: "1.5rem",
          }}
        >
          {image.title}
          <ImageMarked className="MuiImageMarked-root" />
        </Typography>
      </Image>
    </ImageButton>
  );
};

function Salons(props) {
  return (
    <>
      <Head>
        <title>Locks&Layers</title>
        <meta name="description" content="Locks&Layers locations" />
      </Head>
      <Grid
        container
        spacing={0}
        alignItems="center"
        sx={{
          height: "calc(100vh - 100px)",
        }}
      >
        {images.map((image, i) => (
          <Grid item xs={4} key={`loc-el-${i}`}>
            <ButtonBases image={image} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Salons;
