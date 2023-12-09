import { OrbitControls } from "@react-three/drei";
import { useAtom } from "jotai";
import { charactersAtom } from "./SocketManager";
import { Character, Map } from "./index";

export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  return (
    <>
      <Map />
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
