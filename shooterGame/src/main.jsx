import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LightNodeProvider } from "@waku/react";
import { Protocols } from "@waku/sdk";
// import { MoralisProvider } from "react-moralis";

const protocols = [Protocols.Store, Protocols.Filter, Protocols.LightPush];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <MoralisProvider initializeOnMount={false}> */}
    <LightNodeProvider
      options={{ defaultBootstrap: true }}
      protocols={protocols}
    >
      <App />
    </LightNodeProvider>
    {/* </MoralisProvider> */}
  </React.StrictMode>
);
