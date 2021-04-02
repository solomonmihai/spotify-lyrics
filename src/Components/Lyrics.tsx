import { useState, useEffect } from "react";
import { Container, Spinner, Text, Box } from "@chakra-ui/react";
import SongStore from "../Stores/SongStore";
import LyricsText from "./LyricsText";
import fetchLyrics from "../Utils/LyricsFetch";

export default function Lyrics() {
  const [songData, setSongData] = useState<any>();
  const [lyrics, setLyrics] = useState<any>();
  const [loaded, setLoaded] = useState(false);

  SongStore.subscribe(
    (state) => state.songData,
    (newSongData) => {
      setSongData(newSongData);
    }
  );

  useEffect(() => {
    if (songData) {
      const encSong = encodeURIComponent(songData.item.name);
      const encArtist = encodeURIComponent(songData.item.artists[0].name);

      fetchLyrics(encSong, encArtist).then((res) => {
        // console.log(res);
        setLyrics(res);
        setLoaded(true);
      });
    }
  }, [songData]);

  if (!loaded) {
    return (
      <Box textAlign="center" fontWeight="bold" fontSize="1.2em">
        <Box transform="translate(0, -0%)" marginTop="25%">
          <Text>Loadin' bro</Text>
          <Spinner size="lg" />
        </Box>
      </Box>
    );
  }

  if (!lyrics) {
    return null;
  }

  return (
    <Container textAlign="center">
      <LyricsText lyrics={lyrics} />
    </Container>
  );
}
