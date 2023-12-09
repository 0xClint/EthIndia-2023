import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import React, { useEffect, useState } from "react";

const Tree = ({ boundary, count }) => {
  const model = useGLTF("./tree3.glb");
  //   const model = useGLTF(
  //     "https://ipfs.io/ipfs/bafybeibxww4e3izlem5cevdjpltf43zagjgf4u3h7k6dndbcjqqievkkby/tree.glb" ||
  //       "./tree.glb"
  //   );
  const [trees, setTrees] = useState([]);

  const newPosition = (box, boundary) => {
    return (
      boundary / 2 -
      box / 2 -
      (boundary - box) * (Math.round(Math.random() * 100) / 100)
    );
  };

  const updatePosition = (treeArray, boundary) => {
    treeArray?.forEach((tree, index) => {
      tree.position.x = newPosition(tree.box, boundary);
      tree.position.z = newPosition(tree.box, boundary);
    });
    setTrees(treeArray);
  };

  useEffect(() => {
    const tempTrees = [];
    for (let i = 0; i < count; i++) {
      tempTrees.push({ position: { x: 0, z: 0 }, box: 1 });
    }
    updatePosition(tempTrees, boundary);
  }, [boundary, count]);
  return (
    <group>
      {trees.map((tree, index) => {
        return (
          <object3D
            position={[tree.position.x, 0, tree.position.z]}
            key={index}
          >
            <primitive object={model.scene.clone()} />
          </object3D>
        );
      })}
    </group>
  );
};

export default Tree;
