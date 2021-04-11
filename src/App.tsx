import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Box, ChakraProvider, ColorMode, extendTheme } from "@chakra-ui/react";

import LandingPage from "./Pages/LandingPage";
import RedirectPage from "./Pages/RedirectPage";
import DashboardPage from "./Pages/DashboardPage";
import Header from "./Components/Header";
import AuthStore from "./Stores/AuthStore";

import "./App.scss";

const chooseGradient = (colorMode: ColorMode) => {
  if (colorMode == "dark") {
    return "linear-gradient(190deg, rgba(0,0,0,1) 0%, rgba(15, 15, 15,1) 100%)";
  }

  return null;
};

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        backgroundColor: props.colorMode == "light" ? "white" : "black",
        backgroundImage: chooseGradient(props.colorMode),
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      },
    }),
  },
  colors: {
    accent: {
      100: "#9733ee",
      200: "#9733ee",
      300: "#9733ee",
      400: "#9733ee",
      500: "#9733ee",
      600: "#9733ee",
      700: "#9733ee",
      800: "#9733ee",
      900: "#9733ee",
    },
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
