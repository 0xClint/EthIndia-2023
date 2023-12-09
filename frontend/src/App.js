
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { Suspense } from "react";
import { Tree } from './GameComponents';
import { Physics } from '@react-three/rapier';
import { SocketManager } from './GameComponents/SocketManager';
import { Experience } from './GameComponents/Experience';



function App() {


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <SocketManager />
      <Canvas shadows camera={{ position: [0, 6, 14], fov: 42 }}>
        <OrbitControls />
        <axesHelper />
        <gridHelper />
        <color attach="background" args={["#dbecfb"]} />
        {/* <fog attach="fog" args={["#dbecfb", 30, 40]} /> */}
        <directionalLight intensity={1} shadow-bias={-0.0004} position={[-20, 20, 20]}>
          <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
        </directionalLight>
        <ambientLight intensity={0.2} />
        <Suspense>
          <Physics  >
            <Experience />
          </Physics>
        </Suspense>
      </Canvas>
    </div >
  );
}

export default App;