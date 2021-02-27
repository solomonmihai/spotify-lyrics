import React from "react";
import { Box, Container, Text, Button, Heading, VStack } from "@chakra-ui/react";
import { FaSpotify } from "react-icons/fa";
import AuthStore from "../Stores/AuthStore";
import { Redirect } from "react-router-dom";

const spotifyAuthUrl = "https://accounts.spotify.com/authorize";
const spotifyClientID = "9895e0ba277e4d509bad2a2efa893e69";
const spotifyRedirectUrl = "http://localhost:3000/redirect";
const spotifyAuthScopes = [
  "user-read-currently-playing",
  "user-top-read",
  "app-remote-control",
  "user-modify-playback-state",
  "user-read-playback-state",
];

export default function LandingPage() {
  const token = AuthStore.useState((state) => state.token);

  if (token) {
    return (
      <Redirect
        to={{
          pathname: "/dashboard",
        }}
      />
    );
  }

  const url = `${spotifyAuthUrl}?client_id=${spotifyClientID}&redirect_uri=${spotifyRedirectUrl}&response_type=token&show_dialog=false&scope=${spotifyAuthScopes
    .map((scope) => scope + " ")
    .join("")
    .trim()}`;

  function login() {
    window.location.href = url;
  }

  return (
    <Container textAlign="center">
      <VStack mt="100px" spacing="100px">
        <Heading>Spotify Lyrics</Heading>
        <Button onClick={login}>
          <FaSpotify style={{ marginRight: "10px" }} />
          Get Started
        </Button>
      </VStack>
    </Container>
  );
}
