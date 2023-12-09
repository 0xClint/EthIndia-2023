import { Loader, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "./components/Experience";
import { Leaderboard } from "./components/Leaderboard";
import { ContentPairProvider } from "@waku/react";
import { nanoid } from "nanoid";

function App() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  const [roomIdSuccess, setRoomIdSuccess] = useState(false);
  const [roomId, setRoomId] = useState("");
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

  return roomIdSuccess ? (
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
    <div>
      <h1>Shoot Id</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          onClick={() => {
            setRoomId(nanoid().toLocaleUpperCase().slice(0, 5));
            setRoomIdSuccess(true);
          }}
        >
          Create
        </button>
        <input
          type="text"
          value={roomId}
          onChangeCapture={(e) => setRoomId(e.target.value)}
        />
        <button onClick={() => handleJoin()}>Join</button>
      </div>
    </div>
  );
}

export default App;
