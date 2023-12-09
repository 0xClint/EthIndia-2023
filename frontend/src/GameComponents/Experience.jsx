import { ContactShadows, OrbitControls, useCursor } from "@react-three/drei";
import { useAtom } from "jotai";
import { useState } from "react";
import { charactersAtom } from "./SocketManager";
import { Map } from "./Map";
import { Character } from "./Character";
export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  return (
    <>
      <Map />
      <ContactShadows blur={2} />
      <OrbitControls />
      {characters.map((character) => (
        <Character
          key={character.id}
          ide={character.id}
          value={character.value}
          position={[
            character.position[0],
            character.position[1],
            character.position[2],
          ]}
          angle={character.angle}
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}
    </>
  );
};
