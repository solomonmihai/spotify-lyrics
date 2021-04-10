import { Box, Tag, Text, Image, VStack } from "@chakra-ui/react";
import SongStore from "../Stores/SongStore";

export default function SongCard() {
  const songData: any = SongStore.useState((state) => state.songData);

  if (!songData) {
    return null;
  }

  const albumCover = songData.item.album.images[0].url;

  return (
    <VStack p="10px" mb="20px">
      <Image maxW="200px" src={albumCover} borderRadius="15px" />
      <VStack width="100%">
        <Text fontWeight="bold" textAlign="center" fontSize="1.4em">
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
    </VStack>
  );
}
