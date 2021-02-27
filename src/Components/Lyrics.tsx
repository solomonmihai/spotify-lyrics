import { useState, useEffect } from "react";
import { Container, Text } from "@chakra-ui/react";
import axios from "axios";
import SongStore from "../Stores/SongStore";
import LyricsText from "./LyricsText";

// maybe host my own cors anywhere server
const corsurl = "https://api.allorigins.win/get?url=";

export enum LyricsSrc {
  ovh,
  textyl,
}

export default function Lyrics() {
  const [songData, setSongData] = useState<any>();
  const [lyrics, setLyrics] = useState<any>();
  const [progress, setProgress] = useState<number | null>();
  const [lyricsSrc, setLyricsSrc] = useState<LyricsSrc | null>();

  SongStore.subscribe(
    (state) => state.songData,
    (newSongData) => {
      setSongData(newSongData);
    }
  );

  function getLyricsOvh(artist: string, song: string) {
    const url = `https://api.lyrics.ovh/v1/${artist}/${song}`;

    axios
      .get(url)
      .then((res) => {
        const lyricsArr: [] = res.data.lyrics.split(/\r\n|\r|\n/);
        for (let i = 0; i < lyricsArr.length; i++) {
          if (lyricsArr[i] == "") {
            lyricsArr.splice(i, 1);
          }
        }
        setLyrics(lyricsArr);
        setLyricsSrc(LyricsSrc.ovh);
      })
      .catch((err) => console.log("Ovh lyrics err: ", err));
  }

  function getLyricsTextyl(artist: string, song: string) {
    const url = `${corsurl}https://api.textyl.co/api/lyrics?q=${song} ${artist}`;

    axios
      .get(url)
      .then((res) => {
        const data = res.data.contents;
        if (!data || data == "No lyrics available") {
          getLyricsOvh(artist, song);
          setLyricsSrc(LyricsSrc.ovh);
        } else {
          setLyrics(JSON.parse(data));
          setLyricsSrc(LyricsSrc.textyl);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (songData) {
      const encSong = encodeURIComponent(songData.item.name);
      const encArtist = encodeURIComponent(songData.item.artists[0].name);
      // not working atm
      // getLyricsTextyl(encArtist, encSong);
      getLyricsOvh(encArtist, encSong);

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

  if (!lyrics) {
    return null;
  }

  return (
    <Container textAlign="center">
      <LyricsText lyrics={lyrics} progress={progress!} lyricsSrc={lyricsSrc!} />
    </Container>
  );
}
