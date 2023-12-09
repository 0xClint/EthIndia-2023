import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Physics } from "@react-three/rapier";
import "./Game.css";
import { ethers } from "ethers";
import { SocketManager } from "../GameComponents/SocketManager";
import { Experience } from "../GameComponents/Experience";
import { checkAvatarFunc, createAvatarFunc } from "../utils/functionCall";
import { useMoralis } from "react-moralis";
import { Loader } from "../components";

const Game = () => {
  const [loader, setLoader] = useState(false);
  const [playerMenu, setPlayerMenu] = useState(false);
  const [isNewPlayer, setIsNewPlayer] = useState(false);
  const { account } = useMoralis();

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
    setLoader(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      await createAvatarFunc(signer);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* <div
        className="absolute  cursor-pointer z-10 left-1 icon-container gap-2"
        style={{ width: "280px", height: "10px" }}
      >
        <div className="w-[90%] h-[160px] rounded-lg bg-black py-5 my-2"></div>
        <div className="w-[90%] h-[160px] rounded-lg bg-black py-5 my-2"></div>
        <div className="w-[90%] h-[160px] rounded-lg bg-black py-5 my-2"></div>
        <div className="w-[80%] h-[135px] rounded-lg bg-black py-5 my-2"></div>
      </div>
      <div
        className="absolute bottom-[75px] cursor-pointer z-10 left-1 p-1 small-card-container gap-2"
        style={{ width: "200px", height: "160px" }}
      >
        <div className="h-[100px] overflow-y-scroll">
          <p className="hover:bg-[#ffffff] rounded-md px-3">Player 1</p>
          <p className="hover:bg-[#ffffff] rounded-md px-3">Player 1</p>
          <p className="hover:bg-[#ffffff] rounded-md px-3">Player 1</p>
          <p className="hover:bg-[#ffffff] rounded-md px-3">Player 1</p>
          <p className="hover:bg-[#ffffff] rounded-md px-3">Player 1</p>
        </div>
        <div className="w-full make-flex">
          <button
            className="btn w-[90%] mx-auto my-1 mt-2 hover:scale-[102%]"
            style={{ padding: "5px" }}
          >
            Create
          </button>
        </div>
      </div> */}
      {isNewPlayer && (
        <div className="absolute w-[100vw] z-10 h-[100vh] make-flex">
          <div className="w-[600px] h-[400px] py-5 card-container">
            <h3 className="text-center font-medium text-[2rem]">
              Mint your own Arborg
            </h3>
            <div className="avatar-container make-flex flex-wrap gap-3 my-5">
              <img src="#" className="min-w-[100px] min-h-[100px]" />
              <img src="#" className="min-w-[100px] min-h-[100px]" />
              <img src="#" className="min-w-[100px] min-h-[100px]" />
              <img src="#" className="min-w-[100px] min-h-[100px]" />
              <img
                src="#"
                className="min-w-[100px] min-h-[100px] border border-white"
              />
              <img src="#" className="min-w-[100px] min-h-[100px]" />
              <img src="#" className="min-w-[100px] min-h-[100px]" />
              <img src="#" className="min-w-[100px] min-h-[100px]" />
              <img src="#" className="min-w-[100px] min-h-[100px]" />
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
      <SocketManager />
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
    </div>
  );
};

export default Game;
