import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
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
    console.log({ loc: image.title });
    router.push(`/salons/${image.title}`);
  };
  return (
    <ImageButton
      onClick={onClick}
      focusRipple
      style={{
        width: image.width,
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
    <div>
      <Head>
        <title>Locks&Layers</title>
        <meta name="description" content="Locks&Layers locations" />
      </Head>
      <Typography variant="h2" sx={{ mt: 2 }}>
        Salons
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          minWidth: 300,
          width: "100%",
          mt: 4,
        }}
      >
        {images.map((image, i) => (
          <ButtonBases key={`loc-el-${i}`} image={image} />
        ))}
      </Box>
    </div>
  );
}

export default Salons;
