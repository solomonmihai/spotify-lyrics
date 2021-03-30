import { Box, useColorMode } from "@chakra-ui/react";
import React, { useEffect } from "react";
import axios from "axios";

import Lyrics from "../Components/Lyrics";
import SongCard from "../Components/SongCard";
import AuthStore from "../Stores/AuthStore";
import SongStore from "../Stores/SongStore";
import SettingsStore from "../Stores/SettingsStore";

export function getAxiosConfig(token: string) {
  return {
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  };
}

// TODO: check for song change

export default function DashboardPage({ history }: any) {
  const songData: any = SongStore.useState((state) => state.songData);

  const token = AuthStore.useState((state) => state.token);

  const axiosConfig = getAxiosConfig(token ?? "");

  function getSongData() {
    axios
      .get("https://api.spotify.com/v1/me/player/currently-playing", axiosConfig)
      .then((res) => {
        SongStore.update((state) => {
          state.songData = res.data;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    getSongData();
  }, []);

  const { blurredBackground, blurLevel } = SettingsStore.useState((state) => state);
  const { colorMode } = useColorMode();

  if (!token) {
    history.push("/");
  }

  return (
    <Box>
      {colorMode == "dark" && blurredBackground && (
        <Box
          backgroundImage={songData ? `url(${songData.item.album.images[0].url})` : ""}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          filter={`blur(${blurLevel}px) brightness(30%)`}
          position="fixed"
          top="0px"
          left="0px"
          width="100%"
          height="100%"
          zIndex="-999"
        />
      )}
      <SongCard />
      <Lyrics />
    </Box>
  );
}
