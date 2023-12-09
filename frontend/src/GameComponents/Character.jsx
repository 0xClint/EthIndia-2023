import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useGLTF,
  useAnimations,
  CameraControls,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useKeyboard } from "../hooks/useKeyboard";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { useFrame, useGraph } from "@react-three/fiber";
import { socket, idAtom } from "./SocketManager";
import { useAtom } from "jotai";

let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaterion = new THREE.Quaternion();

const directionOffset = ({
  moveForward,
  moveBackward,
  moveLeft,
  moveRight,
}) => {
  var directionOffset = 0;
  if (moveForward) {
    if (moveLeft) {
      directionOffset = (-3 * Math.PI) / 4; // w+a
    } else if (moveRight) {
      directionOffset = (3 * Math.PI) / 4; // w+d
    } else {
      directionOffset = Math.PI; // w+d
    }
  } else if (moveBackward) {
    if (moveLeft) {
      directionOffset = -Math.PI / 4; // s+a
    } else if (moveRight) {
      directionOffset = Math.PI / 4; // s+d
    } else {
      directionOffset = 2 * Math.PI; // s
    }
  } else if (moveLeft) {
    directionOffset = -Math.PI / 2; // a
  } else if (moveRight) {
    directionOffset = Math.PI / 2; //d
  }

  return directionOffset;
};

export function Character(props) {
  const [myid] = useAtom(idAtom);

  const [runspeed, setRunspeed] = useState(202);
  const { moveBackward, moveForward, moveRight, moveLeft, jump, shift } =
    useKeyboard();
  const group = useRef();
  const { materials, animations, scene } = useGLTF("./player2.glb");
  const { actions } = useAnimations(animations, group);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const character = useRef();
  const rigidBody = useRef();
  const currentAction = useRef("");
  const controls = useRef();

  useEffect(() => {
    let action = "";
    if (myid === props.ide) {
      if (moveBackward || moveForward || moveRight || moveLeft) {
        action = "walking";
        if (shift) {
          setRunspeed(250);
          action = "running";
        } else {
          setRunspeed(202);
        }
      } else if (jump) {
        action = "jumping";
      } else {
        action = "idle";
      }

      if (currentAction.current != action) {
        const nextActionToPlay = actions[action];
        const current = actions[currentAction.current];
        current?.fadeOut(0.2);
        nextActionToPlay?.reset().fadeIn(0.2).play();
        currentAction.current = action;
      }
    } else {
      if (
        props.value.moveBackward ||
        props.value.moveForward ||
        props.value.moveRight ||
        props.value.moveLeft
      ) {
        action = "walking";
        if (props.value.shift) {
          setRunspeed(250);
          action = "running";
        } else {
          setRunspeed(202);
        }
      } else if (props.value.jump) {
        action = "jumping";
      } else {
        action = "idle";
      }
      if (currentAction.current != action) {
        const nextActionToPlay = actions[action];
        const current = actions[currentAction.current];
        current?.fadeOut(0.2);
        nextActionToPlay?.reset().fadeIn(0.2).play();
        currentAction.current = action;
      }
    }
    socket.emit("move", {
      moveForward,
      moveBackward,
      moveRight,
      moveLeft,
      jump,
      shift,
    });
  }, [
    moveBackward,
    moveForward,
    moveRight,
    moveLeft,
    jump,
    shift,
    props.value.moveBackward,
    props.value.moveForward,
    props.value.moveRight,
    props.value.moveLeft,
  ]);

  useFrame((state, delta) => {
    // console.log(rigidBody.current);

    if (controls.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
      const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
      const playerWorldPos = vec3(rigidBody.current.translation());
      console.log();

      controls.current.setLookAt(
        playerWorldPos.x + 5,
        playerWorldPos.y + 4,
        playerWorldPos.z + 5,
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z,
        true
      );
      //   controls.current.setLookAt(
      //     playerWorldPos.x + 5,
      //     playerWorldPos.y + 4,
      //     playerWorldPos.z + 5,
      //     playerWorldPos.x + 2,
      //     playerWorldPos.y + 1.5,
      //     playerWorldPos.z,
      //     true
      //   );
    }
    if (
      currentAction.current == "running" ||
      currentAction.current == "walking"
    ) {
      let angle;
      if (myid === props.ide) {
        angle = directionOffset({
          moveForward,
          moveBackward,
          moveLeft,
          moveRight,
        });
      } else {
        angle = directionOffset({
          moveForward: props.value.moveForward,
          moveBackward: props.value.moveBackward,
          moveLeft: props.value.moveLeft,
          moveRight: props.value.moveRight,
        });
      }

      //   *****************Rotate Impulse************
      //console.log(angle)

      if (angle) {
        character.current.rotation.y = angle;

        // move character in its own direction
        const impulse = {
          x: Math.sin(angle) * runspeed * delta,
          y: 0,
          z: Math.cos(angle) * runspeed * delta,
        };

        rigidBody.current.applyImpulse(impulse, true);
        // console.log(rigidBody);
      }

      //   ************************************************

      //rotate model
      rotateQuaterion.setFromAxisAngle(rotateAngle, Math.PI);
      scene.quaternion.rotateTowards(rotateQuaterion, 0.2);
    }
  });
  return (
    <>
      <OrbitControls />
      <CameraControls ref={controls} />
      {/* <PerspectiveCamera ref={controls} makeDefault /> */}
      <RigidBody
        colliders={false}
        ref={rigidBody}
        position={props.position}
        linearDamping={12}
        lockRotations
        {...props}
      >
        <group ref={group} dispose={null}>
          <group name="Scene" ref={character}>
            <group name="Armature">
              <skinnedMesh
                name="EyeLeft"
                geometry={nodes.EyeLeft.geometry}
                material={materials.Wolf3D_Eye}
                skeleton={nodes.EyeLeft.skeleton}
                morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
                morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
              />
              <skinnedMesh
                name="EyeRight"
                geometry={nodes.EyeRight.geometry}
                material={materials.Wolf3D_Eye}
                skeleton={nodes.EyeRight.skeleton}
                morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
                morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
              />
              <skinnedMesh
                name="Wolf3D_Body"
                geometry={nodes.Wolf3D_Body.geometry}
                material={materials.Wolf3D_Body}
                skeleton={nodes.Wolf3D_Body.skeleton}
              />
              <skinnedMesh
                name="Wolf3D_Hair"
                geometry={nodes.Wolf3D_Hair.geometry}
                material={materials.Wolf3D_Hair}
                skeleton={nodes.Wolf3D_Hair.skeleton}
              />
              <skinnedMesh
                name="Wolf3D_Head"
                geometry={nodes.Wolf3D_Head.geometry}
                material={materials.Wolf3D_Skin}
                skeleton={nodes.Wolf3D_Head.skeleton}
                morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
                morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
              />
              <skinnedMesh
                name="Wolf3D_Outfit_Bottom"
                geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
                material={materials.Wolf3D_Outfit_Bottom}
                skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
              />
              <skinnedMesh
                name="Wolf3D_Outfit_Footwear"
                geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
                material={materials.Wolf3D_Outfit_Footwear}
                skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
              />
              <skinnedMesh
                name="Wolf3D_Outfit_Top"
                geometry={nodes.Wolf3D_Outfit_Top.geometry}
                material={materials.Wolf3D_Outfit_Top}
                skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
              />
              <skinnedMesh
                name="Wolf3D_Teeth"
                geometry={nodes.Wolf3D_Teeth.geometry}
                material={materials.Wolf3D_Teeth}
                skeleton={nodes.Wolf3D_Teeth.skeleton}
                morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
                morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
              />
              <primitive object={nodes.mixamorigHips} />
              <primitive object={nodes.Ctrl_Master} />
              <primitive object={nodes.Ctrl_ArmPole_IK_Left} />
              <primitive object={nodes.Ctrl_Hand_IK_Left} />
              <primitive object={nodes.Ctrl_ArmPole_IK_Right} />
              <primitive object={nodes.Ctrl_Hand_IK_Right} />
              <primitive object={nodes.Ctrl_Foot_IK_Left} />
              <primitive object={nodes.Ctrl_LegPole_IK_Left} />
              <primitive object={nodes.Ctrl_Foot_IK_Right} />
              <primitive object={nodes.Ctrl_LegPole_IK_Right} />
            </group>
          </group>
        </group>
        <CapsuleCollider args={[0.8, 0.6]} position={[0, 1.28, 0]} />
      </RigidBody>
    </>
  );
}

useGLTF.preload("./player2.glb");
