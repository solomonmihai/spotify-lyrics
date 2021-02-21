import { Box, Tag, Text, VStack, Image } from "@chakra-ui/react";
import SongStore from "../Stores/SongStore";

export default function SongCard() {
  const songData: any = SongStore.useState((state) => state.songData);

  if (!songData) {
    return null;
  }

  return (
    <VStack
      maxW="300px"
      borderWidth="1px"
      borderRadius="lg"
      position="fixed"
      left="50px"
      top="50%"
      transform="translate(0, -50%)"
      p="2"
    >
      <Image src={songData.item.album.images[0].url} borderRadius="lg" />
      <Text fontWeight="bold" textAlign="center">
        {songData.item.name}
      </Text>
      <Box>
        {songData.item.artists.map((artist: any, index: number) => (
          <Tag key={index} m="1">
            {artist.name}
          </Tag>
        ))}
      </Box>
    </VStack>
  );
}
