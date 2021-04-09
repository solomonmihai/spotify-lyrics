import axios from "axios";

const corsUrl = "https://cors-anywhere-mihai.herokuapp.com/";
const searchUrl = "http://music.163.com/api/search/pc?offset=0&limit=1&type=1&s=";
const lyricsUrl = "https://music.163.com/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&id=";

async function getSongId(song: string, artist: string) {
  const url = `${corsUrl}${searchUrl}${song} ${artist}`;

  const res = await axios.get(url);
  if (res.data.result.songCount == 0 || res.data.result.songs == null) {
    return -1;
  }
  const firstSong = res.data.result.songs[0];

  return firstSong.id;
}

function parseTime(timeString: string): number {
  timeString = timeString.replace(".", ":");
  const arr = timeString.split(":").map((x) => +x);
  const time = +arr[2] + 1000 * (+arr[1] + 60 * +arr[0]);
  return time;
}

function parseLrc(lrc: string) {
  const lyrics = [];
  const arr = lrc.split(/\r\n|\r|\n/);
  for (let i = 0; i < arr.length; i++) {
    const verse = arr[i];
    if (verse === "" || verse.includes("[00:00.000]")) {
      arr.splice(i, 1);
    } else {
      const timeString = verse.match(/\[(.*?)\]/)![1];
      const lyric = verse.split("]")[1];

      lyrics.push({
        time: parseTime(timeString),
        string: lyric,
      });
    }
  }
  return lyrics;
}

export const NOT_FOUND = "NOT FOUND";

export default async function fetchLyrics(song: string, artist: string) {
  const songId = await getSongId(song, artist);
  if (songId === -1) {
    return fetchLyricsTextyl(song, artist);
  }
  const url = `${corsUrl}${lyricsUrl}${songId}`;
  return axios
    .get(url)
    .then((res) => {
      if (res.data.lrc) {
        const lrc = res.data.lrc.lyric;
        const lyrics = parseLrc(lrc);
        return lyrics;
      }

      return fetchLyricsTextyl(song, artist);
    })
    .catch((err) => {
      console.log("error fetching lyrics", err);
      return NOT_FOUND;
    });
}

async function fetchLyricsTextyl(song: string, artist: string) {
  const url = `${corsUrl}https://api.textyl.co/api/lyrics?q=${song} ${artist}`;

  return axios
    .get(url)
    .then((res) =>
      res.data.map(({ lyrics, seconds }: any) => {
        return {
          time: seconds,
          string: lyrics,
        };
      })
    )
    .catch((err) => NOT_FOUND);
}

// function fetchLyricsOvh(song: string, artist: string) {
// const url = `https://api.lyrics.ovh/v1/${artist}/${song}`;

// axios
// .get(url, {
// timeout: 10000,
// })
// .then((res) => {
// const list = (res.data.lyrics as string)
// .split(/\r\n|\r|\n/)
// .filter((lyric) => lyric != "")
// .map((s) => {
// return {
// string: s,
// };
// });

// return list;
// });
// }
