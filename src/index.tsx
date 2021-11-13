import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import LandingPage from "./components/LandingPage";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <LandingPage />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
