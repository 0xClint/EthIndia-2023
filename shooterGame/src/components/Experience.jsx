import { Environment } from "@react-three/drei";
import {
  Joystick,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { useEffect, useState } from "react";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { CharacterController } from "./CharacterController";
import { Map } from "./Map";
import protobuf from "protobufjs";
import {
  useWaku,
  useContentPair,
  useLightPush,
  useStoreMessages,
  useFilterMessages,
  ContentPairProvider,
} from "@waku/react";

export const Experience = ({ downgradedPerformance = false, roomId }) => {
  const [players, setPlayers] = useState([]);
  const [messageData, setMessageData] = useState([]);

  // ********************Waku Hooks ***********************************

  const { node, isLoading } = useWaku();

  const { decoder, encoder } = useContentPair();

  // Query Store peers for past messages
  const { messages: storeMessages } = useStoreMessages({ node, decoder });

  // Receive messages from Filter subscription
  const { messages: filterMessages } = useFilterMessages({ node, decoder });

  // Send the message using Light Push
  const { push } = useLightPush({ node, encoder });

  // Create a message structure
  const ChatMessage = new protobuf.Type("ChatMessage")
    .add(new protobuf.Field("timestamp", 1, "uint64"))
    .add(new protobuf.Field("message", 2, "string"));

  // *******************************************************

  useEffect(() => {
    console.log("node : ", node);
    console.log("isLoading : ", isLoading);
  }, [node, isLoading]);

  const start = async () => {
    // Start the game
    console.log("roomID : " + roomId);
    await insertCoin({ roomCode: roomId });

    // Create a joystick controller for each joining player
    onPlayerJoin((state) => {
      // Joystick will only create UI for current player (myPlayer)
      // For others, it will only sync their state
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "fire", label: "Fire" }],
      });
      const newPlayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);
      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  };

  useEffect(() => {
    start();
  }, []);

  const [bullets, setBullets] = useState([]);
  const [hits, setHits] = useState([]);

  const [networkBullets, setNetworkBullets] = useMultiplayerState(
    "bullets",
    []
  );
  const [networkHits, setNetworkHits] = useMultiplayerState("hits", []);

  const onFire = (bullet) => {
    setBullets((bullets) => [...bullets, bullet]);
  };

  const onHit = (bulletId, position) => {
    setBullets((bullets) => bullets.filter((bullet) => bullet.id !== bulletId));
    setHits((hits) => [...hits, { id: bulletId, position }]);
  };

  const onHitEnded = (hitId) => {
    setHits((hits) => hits.filter((h) => h.id !== hitId));
  };

  useEffect(() => {
    setNetworkBullets(bullets);
  }, [bullets]);

  useEffect(() => {
    setNetworkHits(hits);
  }, [hits]);

  const onKilled = (_victim, killer) => {
    const killerState = players.find((p) => p.state.id === killer).state;

    killerState.setState("kills", killerState.state.kills + 1);

    if (myPlayer()?.id == killer) {
      sendMessage();
    }
  };

  // ********************************Waku Integration************

  const sendMessage = async () => {
    const tempMassage = ChatMessage.create({
      timestamp: Date.now(),
      sender: "sender",
      message: "message",
    });
    const serialisedMessage = ChatMessage.encode(tempMassage).finish();
    const timestamp = new Date();

    const { recipients, errors } = await push({
      payload: serialisedMessage,
      timestamp,
    });

    console.log("receipient : " + recipients);
    // Check for errors
    if (errors.length == 0) {
      console.log("MESSAGE PUSHED");
      console.log("receipient : " + recipients);
    } else {
      console.log("error : " + errors);
    }
  };

  // ************************Retrieve messages using store

  // Render both past and new messages
  useEffect(() => {
    console.log("hello");
    const dataArray = [];
    const allMessages = storeMessages.concat(filterMessages);
    allMessages.map((receviedMessage) => {
      const { timestamp, message } = ChatMessage.decode(
        receviedMessage.payload
      );
      dataArray.push({ timestamp, message });
    });
    console.log(dataArray);
    setMessageData(dataArray);
  }, [filterMessages, storeMessages]);

  return (
    <>
      <Map />
      {players.map(({ state, joystick }, index) => (
        <CharacterController
          key={state.id}
          state={state}
          userPlayer={state.id === myPlayer()?.id}
          joystick={joystick}
          onKilled={onKilled}
          onFire={onFire}
          downgradedPerformance={downgradedPerformance}
        />
      ))}
      {(isHost() ? bullets : networkBullets).map((bullet) => (
        <Bullet
          key={bullet.id}
          {...bullet}
          onHit={(position) => onHit(bullet.id, position)}
        />
      ))}
      {(isHost() ? hits : networkHits).map((hit) => (
        <BulletHit key={hit.id} {...hit} onEnded={() => onHitEnded(hit.id)} />
      ))}
      <Environment preset="sunset" />
    </>
  );
};
