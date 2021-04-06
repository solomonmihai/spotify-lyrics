import React, { useEffect, useState } from "react";
import AuthStore from "../Stores/AuthStore";
import axios from "axios";
import { Flex, HStack, Spacer, Image, Text, Box } from "@chakra-ui/react";
import { getAxiosConfig } from "../Pages/DashboardPage";
import SettingsMenu from "./SettingsMenu";

// TODO: show a dark to transparent gradient if scroll level is bigger than 0 or smth
// so the header won't overlap the text

export default function Header() {
  const token = AuthStore.useState((state) => state.token);

  const [user, setUser] = useState<any>();
  const axiosConfig = getAxiosConfig(token ?? "");

  function getUserData() {
    axios
      .get("https://api.spotify.com/v1/me", axiosConfig)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log("Header: error while getting user data", err);
      });
  }

  useEffect(() => {
    if (token) {
      getUserData();
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return (
    <Box mb="50px">
      <Flex
        as="nav"
        justify="space-between"
        pos="fixed"
        p="10px"
        left="0px"
        top="0px"
        width="100%"
        // background="linear-gradient(to top, transparent 0%, black 100%);"
      >

        {user && (
          <HStack>
            <Image w="auto" h="40px" borderRadius="lg" src={user.images[0].url} />
            <Text fontWeight="bold">{user.display_name}</Text>
          </HStack>
        )}
        <Spacer />
        <SettingsMenu />
      </Flex>
    </Box>
  );
}
