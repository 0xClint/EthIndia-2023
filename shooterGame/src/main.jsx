import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LightNodeProvider } from "@waku/react";
import { Protocols } from "@waku/sdk";

const protocols = [Protocols.Store, Protocols.Filter, Protocols.LightPush];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LightNodeProvider
      options={{ defaultBootstrap: true }}
      protocols={protocols}
    >
      <App />
    </LightNodeProvider>
  </React.StrictMode>
);
