import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Box, ChakraProvider, extendTheme, useColorModeValue } from "@chakra-ui/react";

import LandingPage from "./Pages/LandingPage";
import RedirectPage from "./Pages/RedirectPage";
import DashboardPage from "./Pages/DashboardPage";
import Header from "./Components/Header";
import AuthStore from "./Stores/AuthStore";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

function App() {
  const authData = localStorage.getItem("auth");

  if (authData) {
    const { token, expires } = JSON.parse(authData);
    const tokenExpired = Date.parse(expires) < Date.parse(new Date().toString());

    if (!tokenExpired) {
      AuthStore.update((state) => {
        state.token = token;
      });
    } else {
      localStorage.removeItem("auth");
      console.log("token expired");
    }
  }

  return (
    <ChakraProvider theme={theme}>
      <Box className="App">
        <Header />
        <Router>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/redirect" component={RedirectPage} />
          <Route exact path="/dashboard" component={DashboardPage} />
        </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App;
