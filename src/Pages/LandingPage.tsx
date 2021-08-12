import React from "react";
import {
  Grid,
  Text,
  Heading,
  IconButton,
  VStack,
  Box,
  Image,
  GridItem,
  useColorMode,
} from "@chakra-ui/react";
import { FaGithub, FaSpotify, FaTwitter } from "react-icons/fa";
import AuthStore from "../Stores/AuthStore";
import { Redirect } from "react-router-dom";

import fiverrIcon from "../assets/fiverr-icon.png";

const spotifyAuthUrl = "https://accounts.spotify.com/authorize";
const spotifyClientID = "9895e0ba277e4d509bad2a2efa893e69";
const spotifyAuthScopes = [
  "user-read-currently-playing",
  "user-top-read",
  "app-remote-control",
  "user-modify-playback-state",
  "user-read-playback-state",
];

function getRedirectUri(): string {
  const localhostUri = "http://localhost:3000/redirect";
  const ipUri = "http://127.0.0.1:3000/redirect";
  const netlifyUri = "https://spotifylyrics.netlify.app/redirect";

  const url = window.location.href;

  if (url.includes("netlify")) {
    return netlifyUri;
  } else if (url.includes("localhost")) {
    return localhostUri;
  } else {
    return ipUri;
  }
}

export default function LandingPage() {
  const token = AuthStore.useState((state) => state.token);
  const { colorMode } = useColorMode();

  if (token) {
    return (
      <Redirect
        to={{
          pathname: "/dashboard",
        }}
      />
    );
  }

  const redirectUri = getRedirectUri();

  const url = `${spotifyAuthUrl}?client_id=${spotifyClientID}&redirect_uri=${redirectUri}&response_type=token&show_dialog=false&scope=${spotifyAuthScopes
    .map((scope) => scope + " ")
    .join("")
    .trim()}`;

  function login() {
    window.location.href = url;
  }

  return (
    <Box height="80vh">
      <VStack mt="150px" spacing="100px">
        <Heading
          fontStyle="italic"
          fontWeight="extrabold"
          fontSize="4em"
          bgGradient={["linear(to bottom, #7928CA, #ff0080) "]}
          bgClip="text"
        >
          Spotify Lyrics
        </Heading>
        <button onClick={login} className="btn-grad">
          <FaSpotify style={{ marginRight: "10px", marginBottom: "5px", display: "inline" }} />
          Get Started
        </button>
      </VStack>

      <Grid
        position="absolute"
        bottom="2%"
        left="50%"
        templateColumns="repeat(3, 50px)"
        transform="translate(-50%, 0)"
        columnGap="5px"
      >
        <GridItem colSpan={3}>
          <Text fontSize="15px" textAlign="center" color="#777777">
          </Text>
        </GridItem>
        <IconButton
          backgroundColor="transparent"
          as="a"
          href="https://twitter.com/msolomon_dev"
          icon={<FaTwitter />}
          aria-label="twitter icon"
        />
        <IconButton
          backgroundColor="transparent"
          as="a"
          href="https://github.com/mihaisolomon"
          icon={<FaGithub />}
          aria-label="github icon"
        />
        <IconButton
          backgroundColor="transparent"
          aria-label="fiverr icon"
          as="a"
          href="https://www.fiverr.com/mihaisolomon64"
          icon={
            <Image
              width="15px"
              filter={colorMode == "dark" ? `brightness(0) invert(1)` : ""}
              src={fiverrIcon}
            />
          }
        />
      </Grid>
    </Box>
  );
}
