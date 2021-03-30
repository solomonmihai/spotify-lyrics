import axios from "axios";

const corsUrl = "https://cors-anywhere-mihai.herokuapp.com/";
const searchUrl = "http://music.163.com/api/search/pc?offset=0&limit=1&type=1&s=";
const lyricsUrl = "https://music.163.com/api/song/lyric?os=pc&lv=-1&kv=-1&tv=-1&id=";

async function getSongId(song: string, artist: string) {
  const url = `${corsUrl}${searchUrl}${song} ${artist}`;

  const res = await axios.get(url);
  const firstSong = res.data.result.songs[0];

  return firstSong.id;
}

function parseTime(timeString: string): number {
  timeString = timeString.replace(".", ":");
  const arr = timeString.split(":").map((x) => +x);
  const time = +arr[2] + 1000 * (+arr[1] + 60 * +arr[0]);
  return time;
}

// TODO: check Arctic Monkeys - Arabella LRC

function parseLrc(lrc: string) {
  const lyrics = [];
  const arr = lrc.split(/\r\n|\r|\n/);
  for (let i = 0; i < arr.length; i++) {
    const verse = arr[i];
    if (verse == "") {
      arr.splice(i, 1);
    } else {
      const timeString = verse.match(/\[(.*?)\]/)![1];
      const lyric = verse.split("]")[1];

      // TODO: remove lyrics that have chinese
      if (lyric == "") {
        continue;
      } else {
        lyrics.push({
          time: parseTime(timeString),
          lyric: lyric,
        });
      }
    }
  }
  return lyrics;
}

// provide args as encoded uri components
// TODO: also check if lyrics exist
export default async function fetchLyrics(song: string, artist: string) {
  const songId = await getSongId(song, artist);
  const url = `${corsUrl}${lyricsUrl}${songId}`;
  return axios.get(url).then((res) => {
    const lrc = res.data.lrc.lyric;
    const lyrics = parseLrc(lrc);
    return lyrics;
  });
}

// function getLyricsOvh(artist: string, song: string) {
// const url = `https://api.lyrics.ovh/v1/${artist}/${song}`;

// axios
// .get(url, {
// timeout: 10000,
// })
// .then((res) => {
// const lyricsArr: [] = res.data.lyrics.split(/\r\n|\r|\n/);
// for (let i = 0; i < lyricsArr.length; i++) {
// if (lyricsArr[i] == "") {
// lyricsArr.splice(i, 1);
// }
// }
// setLyrics(lyricsArr);
// setLyricsSrc(LyricsSrc.ovh);
// setLoaded(true);
// })
// .catch((err) => {
// console.log("Ovh lyrics err: ", err);
// setNotFound(true);
// });
// }

// function getLyricsTextyl(artist: string, song: string) {
// const url = `${corsurl}https://api.textyl.co/api/lyrics?q=${song} ${artist}`;

// axios
// .get(url)
// .then((res) => {
// setLyrics(res.data);
// setLyricsSrc(LyricsSrc.textyl);
// setLoaded(true);
// })
// .catch((err) => {
// console.log("Textyl err: ", err);
// getLyricsOvh(artist, song);
// });
// }
