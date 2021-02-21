import React from "react";
import { Text } from "@chakra-ui/react";
import SettingsStore from "../Stores/SettingsStore";
import { LyricsSrc } from "./Lyrics";

type Props = {
  lyrics: [];
  progress: number;
  lyricsSrc: LyricsSrc;
};

export default function LyricsText({ lyrics, progress, lyricsSrc }: Props) {
  const { fontSize, fontSpacing } = SettingsStore.useState((state) => state);
  return (
    <>
      {lyrics.map((verse: any, index: number) => {
        let isCurrent = false;

        if (
          lyricsSrc == LyricsSrc.textyl &&
          verse.seconds <= progress + 2 &&
          verse.seconds >= progress - 2
        ) {
          // isCurrent = true;
        }

        return (
          <Text
            whiteSpace="pre-line"
            key={index}
            fontSize={isCurrent ? `${fontSize + 0.2}em` : `${fontSize}em`}
            // fontWeight={isCurrent ? "bold" : "normal"}
            transition="all ease 0.25s"
            fontWeight="bold"
            my={`${fontSpacing}px`}
            // color={isCurrent ? undefined : "#aaa"}
            color="#ccc"
          >
            {lyricsSrc == LyricsSrc.ovh ? verse : verse.lyrics}
          </Text>
        );
      })}
    </>
  );
}
