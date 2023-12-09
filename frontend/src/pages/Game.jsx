import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import { Physics } from "@react-three/rapier";
import "./Game.css";
import { SocketManager } from "../GameComponents/SocketManager";
import { Experience } from "../GameComponents/Experience";

const Game = () => {
  const [playerMenu, setPlayerMenu] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
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
        {/* <p className="hover:bg-[#ffffff] rounded-md px-3 font-bold">Public</p> */}
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
      </div>
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
    </div>
  );
};

export default Game;
