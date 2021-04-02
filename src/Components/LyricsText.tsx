import React from "react";
import { Text, useColorMode } from "@chakra-ui/react";
import SettingsStore from "../Stores/SettingsStore";

type Props = {
  lyrics: [];
};

export default function LyricsText({ lyrics }: Props) {
  const { fontSize, fontSpacing } = SettingsStore.useState((state) => state);
  const { colorMode } = useColorMode();
  return (
    <>
      {lyrics.map((verse: any, index: number) => {
        return (
          <Text
            whiteSpace="pre-line"
            key={index}
            fontSize={`${fontSize}em`}
            // fontWeight={isCurrent ? "bold" : "normal"}
            transition="all ease 0.25s"
            fontWeight="bold"
            my={`${fontSpacing}px`}
            // color={isCurrent ? undefined : "#aaa"}
            color={colorMode == "dark" ? "whiteAlpha.800" : "black"}
          >
            {verse.string}
          </Text>
        );
      })}
    </>
  );
}
