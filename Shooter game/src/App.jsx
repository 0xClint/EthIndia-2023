import { Loader, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "./components/Experience";
import { Leaderboard } from "./components/Leaderboard";

function App() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);

  function clickAtPoint(x, y) {
    const element = document.elementFromPoint(x, y);

    if (element) {
      const rect = element.getBoundingClientRect();
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left + x,
        clientY: rect.top + y,
      });
      element.dispatchEvent(clickEvent);
    } else {
      console.error("No element found at the specified coordinates.");
    }
  }

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const updateCursorPosition = (event) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      updateCursorPosition(event);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const onclickFunc = () => {
    clickAtPoint(142, 622);
    console.log("Hell");
  };
  const tempClick = () => {
    console.log("tempClick");
  };

  return (
    <>
      <Loader />
      <div
        style={{
          transform: "translate(200px,0px",
          position: "absolute",
          zIndex: 100,
        }}
      >
        <p>Cursor Position:</p>
        <p>X: {position.x}</p>
        <p>Y: {position.y}</p>
        <button onClick={() => onclickFunc()}>Click</button>
        <button onClick={() => tempClick()}>TempClick</button>
      </div>
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
            <Experience downgradedPerformance={downgradedPerformance} />
          </Physics>
        </Suspense>
        {!downgradedPerformance && (
          // disable the postprocessing on low-end devices
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </>
  );
}

export default App;
