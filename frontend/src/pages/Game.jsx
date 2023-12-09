import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useState } from "react";
import { Physics } from "@react-three/rapier";
import "./Game.css";
import { useAtom } from "jotai";
import {
  SocketManager,
  idAtom,
  mycharactersAtom,
  socket,
} from "../GameComponents/SocketManager";
import { Experience } from "../GameComponents/Experience";
import { charactersAtom } from "../GameComponents/SocketManager";
import {
  useRoom,
  useLocalVideo,
  usePeerIds,
  useLocalAudio,
} from "@huddle01/react/hooks";
import axios from "axios";
import { useEffect, useRef } from "react";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import RemotePeer from "./RemotePeer";
import { ethers } from "ethers";
import { checkAvatarFunc, createAvatarFunc } from "../utils/functionCall";
import { useMoralis } from "react-moralis";
import { ChatBox, Loader } from "../components";
import { imgData } from "../utils/constants";
import { ContentPairProvider } from "@waku/react";

const Game = () => {
  const [loader, setLoader] = useState(false);
  const [playerMenu, setPlayerMenu] = useState(false);
  const [characters] = useAtom(charactersAtom);
  const [char, mychare] = useState(characters);
  const [mycharacter] = useAtom(mycharactersAtom);
  const [mychar, setmyChar] = useState(mycharacter);
  const [token, setToken] = useState(null);

  const crateToken = async () => {
    const accessToken = new AccessToken({
      apiKey: "R_hAxJCqC19AKCqWR1Lg8VatlvzQLU_O",
      roomId: roomId,
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
      options: {
        metadata: {
          // you can add any custom attributes here which you want to associate with the user
          walletAddress: "axit.eth",
        },
      },
    });

    console.log("accessToken", accessToken);
    const token = await accessToken.toJwt();
    setToken(token);
  };

  useEffect(() => {
    crateToken();
  }, []);

  const [roomCreationError, setRoomCreationError] = useState(null);
  const [roomId, setRoomId] = useState("xtq-csxb-thc");
  const [inpeer, setPeer] = useState([]);
  const createRoom = async () => {
    try {
      const response = await axios.post(
        "https://api.huddle01.com/api/v1/create-room",
        {
          title: "Huddle01-Test",
          hostWallets: ["0xC7462A4D4f72031dF927A1cF0D8c43e1d2f55166"],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "R_hAxJCqC19AKCqWR1Lg8VatlvzQLU_O",
          },
        }
      );
      console.log(response.data.data.roomId);
      setRoomId(response.data.data.roomId);
      socket.emit("setroomId", { roomId: roomId });
      // Handle the response as needed
    } catch (error) {
      setRoomCreationError(error.message);
    }
  };

  const { joinRoom } = useRoom({
    onJoin: async (room) => {
      console.log("Joined the room", room);
      await enableVideo();
      await enableAudio();
    },
    onPeerJoin: (peer) => {
      console.log("onPeerJoin", peer);
    },
  });

  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, isAudioOn, stream: audioStream } = useLocalAudio();
  const videoRef = useRef(null);
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  console.log({ audioStream, isAudioOn });
  const { peerIds } = usePeerIds();
  console.log({ peerIds });
  console.log("inpeer", inpeer);
  const [myid] = useAtom(idAtom);
  const [isNewPlayer, setIsNewPlayer] = useState(false);
  const [avatarSelector, setAvatarSelector] = useState("");

  useEffect(() => {
    const checkAvatar = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setIsNewPlayer(!(await checkAvatarFunc(signer)));
        setLoader(false);
      } catch (error) {
        console.log(error);
        setLoader(false);
      }
    };
    checkAvatar();
  }, []);

  const createAvatar = async () => {
    const cid = imgData.filter((item) => item.id == avatarSelector);

    if (avatarSelector) {
      setLoader(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        await createAvatarFunc(signer, cid);
        setLoader(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <ContentPairProvider contentTopic={`/arcave/arcverse/chat`}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <SocketManager />
        <div>
          <div
            className="absolute  cursor-pointer z-10 left-1 icon-container gap-2"
            style={{ width: "280px", height: "10px" }}
          >
            {peerIds.map((peerId) => (
              <RemotePeer key={peerId} peerId={peerId} />
            ))}
            {isVideoOn && (
              <div className="w-[80%] h-[135px] rounded-lg bg-black py-5 my-2">
                <video
                  ref={videoRef}
                  style={{ width: "100%", height: "100%" }}
                  autoPlay
                ></video>
              </div>
            )}
          </div>
          <div
            className="absolute bottom-[75px] cursor-pointer z-10 left-1 p-1 small-card-container gap-2"
            style={{ width: "200px", height: "160px" }}
          >
            <div className="h-[100px] overflow-y-scroll">
              <>
                {characters?.map((character) =>
                  // Check if character.id exists
                  character.id != myid ? (
                    // If character.id exists, render myid
                    <div
                      className="flex flex-row justify-between pr-3"
                      key={character.id}
                    >
                      <p className="hover:bg-[#ffffff] rounded-md px-3">
                        {character.bottomColor}
                      </p>
                      <div className=""> Online</div>
                    </div>
                  ) : null
                )}
              </>
            </div>

            <div className="w-full make-flex">
              {mycharacter.roomId === "#" ? (
                <button
                  key={mycharacter.roomId} // Adding a unique key prop
                  onClick={async () => await createRoom()}
                  className="btn w-[90%] mx-auto my-1 mt-2 hover:scale-[102%]"
                  style={{ padding: "5px" }}
                >
                  Create
                </button>
              ) : (
                <button
                  key={mycharacter.roomId} // Adding a unique key prop
                  onClick={async () =>
                    await joinRoom({
                      roomId: mycharacter.roomId, // Use mycharacter.roomId instead of character.roomId
                      token: token,
                    })
                  }
                  className="btn w-[90%] mx-auto my-1 mt-2 hover:scale-[102%]"
                  style={{ padding: "5px" }}
                >
                  Join
                </button>
              )}
            </div>
          </div>
        </div>
        {isNewPlayer && (
          <div className="absolute w-[100vw] z-10 h-[100vh] make-flex">
            <div className="w-[600px] h-[400px] py-5 card-container">
              <h3 className="text-center font-medium text-[2rem]">
                Mint your own Arborg
              </h3>
              <div className="avatar-container make-flex flex-wrap gap-3 my-5">
                {imgData.map(({ id, cid }) => {
                  return (
                    <div
                      key={id}
                      onClick={() => setAvatarSelector(id)}
                      className="w-[100px] h-[100px] rounded-md overflow-hidden"
                      style={{
                        border:
                          id == avatarSelector ? "2px solid white" : "none",
                      }}
                    >
                      <img
                        src={`https://ipfs.io/ipfs/${cid}/p${id}.png`}
                        className="h-[100%] cursor-pointer"
                      />
                    </div>
                  );
                })}

                <div className="min-w-[100px] min-h-[100px] border-2 border-white rounded-lg text-white text-[3rem] make-flex">
                  +
                </div>
              </div>
              <div className="make-flex">
                <button
                  className="btn w-60 text-[1.5rem]"
                  onClick={() => createAvatar()}
                >
                  Mint
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-2 cursor-pointer z-10 left-2 icon-container">
          <img
            src={"#"}
            onClick={async () => await createRoom()}
            style={{
              backgroundColor: "rgba(198, 198, 198, 0.544)",
              padding: "13px",
            }}
          />
        </div>
        <div className="absolute bottom-2 cursor-pointer z-10 right-2 icon-container">
          <img
            src={"#"}
            style={{
              backgroundColor: "rgba(198, 198, 198, 0.544)",
              padding: "13px",
            }}
          />
        </div>

        <Canvas shadows camera={{ position: [0, 6, 14], fov: 42 }}>
          <OrbitControls />
          <axesHelper />
          <gridHelper />
          <color attach="background" args={["#dbecfb"]} />
          {/* <fog attach="fog" args={["#dbecfb", 30, 40]} /> */}
          <directionalLight
            intensity={1}
            shadow-bias={-0.0004}
            position={[-20, 20, 20]}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-20, 20, 20, -20]}
            />
          </directionalLight>
          <ambientLight intensity={0.2} />
          <Suspense>
            <Physics debug gravity={[0, -50, 0]}>
              <Experience />
            </Physics>
          </Suspense>
        </Canvas>
        {loader && <Loader />}
        <ChatBox />
      </div>
    </ContentPairProvider>
  );
};

export default Game;
