import { Loader, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "./components/Experience";
import { Leaderboard } from "./components/Leaderboard";
import { ContentPairProvider } from "@waku/react";
import { nanoid } from "nanoid";
import { bgImg } from "./assets";

function App() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  const [roomIdSuccess, setRoomIdSuccess] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [menu, setMenu] = useState(false);
  const id = "DDSDFF";

  const handleJoin = () => {
    if (roomId) {
      setRoomId(roomId.slice(1));
      console.log("roomid", roomId);
      setRoomIdSuccess(true);
    } else {
      console.log("enter correct room id");
    }
  };

  return (
    <>
      <div className="absolute top-[80px] text-[1.2rem] z-10 text-white">
        Room Id : R{roomId}
      </div>

      <img src={bgImg} className="absolute -z-10 h-screen w-screen" />
      {menu && (
        <div
          className="fixed z-10 top-0 w-[100vw] h-[100vh]  flex justify-center items-center"
          style={{ background: "rgba(223, 223, 223, 0.22)" }}
        >
          <div className="card-container w-[500px] h-[350px] py-5 make-flex flex-col gap-10">
            <div className="">
              <h1 className="text-[3rem] m-0">GAME OVER</h1>
            </div>
            <div className=" make-flex flex-col gap-5">
              <h2 className="text-[1.2rem]">Let's get back to Home!</h2>
              <a
                href="https://eth-india-2023.vercel.app/"
                className="btn text-[2rem] w-80 text-center"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      )}
      {roomIdSuccess ? (
        <ContentPairProvider contentTopic={`/arcave/shoot/${roomId}`}>
          <Loader />
          <Leaderboard />
          <Canvas
            shadows
            camera={{ position: [0, 30, 0], fov: 30, near: 2 }}
            dpr={[1, 1.5]} // optimization to increase performance on retina/4k devices
          >
            <color attach="background" args={["#242424"]} />
            <SoftShadows size={42} />

            <PerformanceMonitor
              // Detect low performance devices
              onDecline={(fps) => {
                setDowngradedPerformance(true);
              }}
            />
            <Suspense>
              <Physics>
                <Experience
                  downgradedPerformance={downgradedPerformance}
                  roomId={roomId}
                  setMenu={setMenu}
                />
              </Physics>
            </Suspense>
            {!downgradedPerformance && (
              // disable the postprocessing on low-end devices
              <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
              </EffectComposer>
            )}
          </Canvas>
        </ContentPairProvider>
      ) : (
        <div className="absolute w-[100vw] h-[100vh] z-10 make-flex">
          <div className="card-container w-[500px] h-[350px] py-5 make-flex flex-col gap-10">
            <div className="">
              <button
                onClick={() => {
                  setRoomId(nanoid().toLocaleUpperCase().slice(0, 5));
                  setRoomIdSuccess(true);
                }}
                className="btn text-[2rem] w-80"
              >
                Create
              </button>
            </div>
            <div className="h-2 bg-[#072a45] w-[300px]"></div>
            <div className=" make-flex flex-col gap-3">
              <input
                type="text"
                value={roomId}
                className="border border-black w-[350px] text-black px-2 h-10 rounded-md"
                onChangeCapture={(e) => setRoomId(e.target.value)}
              />
              <button
                onClick={() => handleJoin()}
                className="btn text-[2rem] w-80"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
