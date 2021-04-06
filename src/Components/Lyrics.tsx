import { useState, useEffect } from "react";
import { Container, Spinner, Text, Box } from "@chakra-ui/react";
import SongStore from "../Stores/SongStore";
import LyricsText from "./LyricsText";
import fetchLyrics, { NOT_FOUND } from "../Utils/LyricsFetch";
import SongCard from "./SongCard";

export default function Lyrics() {
  const [songData, setSongData] = useState<any>();
  const [lyrics, setLyrics] = useState<any>();
  const [loaded, setLoaded] = useState(false);
  const [found, setFound] = useState(false);

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
        if (res === NOT_FOUND) {
          setFound(false);
          setLoaded(true);
        } else {
          setLyrics(res);
          setLoaded(true);
          setFound(true);
        }
      });
    }
  }, [songData]);

  return (
    <Container textAlign="center" p="25px">
      <SongCard />
      {!loaded && (
        <Box textAlign="center" fontWeight="bold" fontSize="1.2em">
          <Box marginTop="25%">
            <Text>Loadin' bro</Text>
            <Spinner size="lg" />
          </Box>
        </Box>
      )}
      {!found && loaded && (
        <Box textAlign="center" fontWeight="bold" fontSize="1.2em">
          <Box marginTop="25%">
            <Text>Could not find lyrics for this song.</Text>
          </Box>
        </Box>
      )}
      {found && loaded && lyrics && <LyricsText lyrics={lyrics} />}
    </Container>
  );
}
