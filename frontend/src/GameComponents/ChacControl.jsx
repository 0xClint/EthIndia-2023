import { PerspectiveCamera, useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import { useKeyboard } from "../hooks/useKeyboard";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { socket } from "./SocketManager";
import { idAtom } from "./SocketManager";
let walkDirection = new THREE.Vector3();
let rotateAngle = new THREE.Vector3(0, 1, 0);
let rotateQuaterion = new THREE.Quaternion();
let cameraTarget = new THREE.Vector3();
import { useAtom } from "jotai";

const MOVEMENT_SPEED = 202;

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

const ChacControl = (props) => {
  const [myid] = useAtom(idAtom);
  console.log("Myid", myid, props.id);
  const model = useGLTF("./player.glb");
  const { actions } = useAnimations(model.animations, model.scene);
  const { moveBackward, moveForward, moveRight, moveLeft, jump, shift } =
    useKeyboard();

  const [animation, setAnimation] = useState("idle");

  const group = useRef();
  const character = useRef();
  const currentAction = useRef("");
  const playerRef = useRef();
  const rigidBody = useRef();
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    let action = "";
    if (moveBackward || moveForward || moveRight || moveLeft) {
      action = "walking";
      if (shift) {
        action = "running";
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
  }, [
    moveBackward,
    moveForward,
    moveRight,
    moveLeft,
    jump,
    shift,
    props.angle,
  ]);

  useFrame((state, delta) => {
    //console.log(rigidBody.current);
    if (
      currentAction.current == "running" ||
      currentAction.current == "walking"
    ) {
      //   console.log(camera.position);
      let angleYCameraDirection = Math.atan2(
        camera.position.x - model.scene.position.x,
        camera.position.z - model.scene.position.z
      );

      let angle = directionOffset({
        moveForward,
        moveBackward,
        moveLeft,
        moveRight,
      });

      if (angle) {
        //console.log("Props0",props)
        character.current.rotation.y = angle;
        // move character in its own direction
        const impulse = {
          x: Math.sin(angle) * MOVEMENT_SPEED * delta,
          y: 0,
          z: Math.cos(angle) * MOVEMENT_SPEED * delta,
        };

        rigidBody.current.applyImpulse(impulse, true);
        // console.log(angleYCameraDirection);
        rotateQuaterion.setFromAxisAngle(rotateAngle, Math.PI);
        model.scene.quaternion.rotateTowards(rotateQuaterion, 0.2);
        //console.log("ANGLE", angle)
        socket.emit("move", angle);
        // console.log(rigidBody);
      }
    }
  });

  return (
    <group ref={group}>
      {/* <PerspectiveCamera /> */}
      <RigidBody
        colliders={false}
        ref={rigidBody}
        linearDamping={12}
        lockRotations
      >
        <group ref={character}>
          <primitive object={model.scene} />
        </group>
        <CapsuleCollider args={[0.8, 0.6]} position={[0, 1.28, 0]} />
      </RigidBody>
    </group>
  );
};

export default ChacControl;
