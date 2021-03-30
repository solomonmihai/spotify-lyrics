import { useState, useEffect } from "react";
import { Container, Spinner, Text, Box } from "@chakra-ui/react";
import SongStore from "../Stores/SongStore";
import LyricsText from "./LyricsText";
import fetchLyrics from "../Utils/LyricsFetch";

// TODO: remove this
export enum LyricsSrc {
  ovh,
  textyl,
};

export default function Lyrics() {
  const [songData, setSongData] = useState<any>();
  const [lyrics, setLyrics] = useState<any>();
  const [progress, setProgress] = useState<number | null>();
  const [lyricsSrc, setLyricsSrc] = useState<LyricsSrc | null>();
  const [loaded, setLoaded] = useState(false);

  // TODO: change this
  const [notFound, setNotFound] = useState(false);

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
        setLyrics(res);
        setLyricsSrc(LyricsSrc.textyl);
        setLoaded(true);
      });

      // add one more second to fix the delay
      setProgress(songData.progress_ms / 1000 + 1);
    }
  }, [songData]);

  useEffect(() => {
    if (progress) {
      const timeoutId = setTimeout(() => {
        setProgress((prev) => prev! + 1);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [progress]);

  if (notFound) {
    return (
      <Box textAlign="center" fontWeight="bold" fontSize="1.2em">
        <Box transform="translate(0, -0%)" marginTop="25%">
          <Text>Sorry man, couldn't find any lyrics for this.</Text>
          <Text>Refreshing may help</Text>
        </Box>
      </Box>
    );
  }

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
      <LyricsText lyrics={lyrics} progress={progress!} lyricsSrc={lyricsSrc!} />
    </Container>
  );
}
