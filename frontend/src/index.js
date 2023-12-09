import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MoralisProvider } from "react-moralis";
import { HuddleProvider, HuddleClient } from '@huddle01/react';
const huddleClient = new HuddleClient({
  projectId: "m8UgUsu4ZumPe9HbRRk2LSVCEzx6T1",
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MoralisProvider initializeOnMount={false}>
    <HuddleProvider client={huddleClient}>
        <App />
    </HuddleProvider>
  </MoralisProvider>
);

