import { Box, useColorMode, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

import Lyrics from "../Components/Lyrics";
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

async function getSongData(config: any) {
  return axios.get("https://api.spotify.com/v1/me/player/currently-playing", config).then((res) => {
    return res.data;
  });
}

export default function DashboardPage({ history }: any) {
  const token = AuthStore.useState((state) => state.token);

  const axiosConfig = getAxiosConfig(token ?? "");

  const [playing, setPlaying] = useState(false);

  const { songData }: any = SongStore.useState((state) => state);

  function updateSongData() {
    getSongData(axiosConfig).then((res) => {
      if (res === "") {
        setPlaying(false);
      } else {
        const newSong = !songData || songData?.item.id !== res.item.id;
        if (newSong) {
          SongStore.update((state) => {
            state.songData = res;
            setPlaying(true);
          });
        }
      }
    });
  }

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!refresh) {
      updateSongData();
    }
    setRefresh(true);
    const id = setTimeout(() => {
      setRefresh(false);
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  }, [refresh]);

  const { blurLevel, brightnessLevel } = SettingsStore.useState((state) => state);
  const { colorMode } = useColorMode();

  if (!token) {
    history.push("/");
  }

  return (
    <Box>
      {colorMode === "dark" && (
        <Box
          backgroundImage={songData ? `url(${songData.item.album.images[0].url})` : ""}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          filter={`blur(${blurLevel}px) brightness(${brightnessLevel}%)`}
          position="fixed"
          top="0px"
          left="0px"
          width="100%"
          height="100%"
          zIndex="-999"
          overflow="hidden"
        />
      )}
      {playing && <Lyrics />}
      {!playing && (
        <Box textAlign="center" fontWeight="bold" fontSize="1.4em">
          <Box marginTop="25%">
            <Text>Nothing playing on Spotify</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
