import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const socket = io(process.env.REACT_APP_TEMP_URL);
export const charactersAtom = atom([]);
export const idAtom = atom([]);
export const mycharactersAtom = atom([]);
export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [mycharacter, setmyCharacter] = useAtom(mycharactersAtom)
  const [myid, setMyid] = useAtom(idAtom);
  useEffect(() => {
    async function onConnect() {
      const socketId = socket.id;
      console.log("connected with socket ID:", socketId);
      setMyid(socket.id);
      console.log("connected");
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    function onHello() {
      console.log("hello");
    }

    async function onCharacters(value) {
      setCharacters(value);
      const character = value.find((character) => character.id === socket.id);
      setmyCharacter(character);
    }

    socket.on("connect", async () => {
      try {
        await onConnect();
      } catch (error) {
        console.error("Error in onConnect:", error);
      }
    });

    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", async (value) => {
      try {
        await onCharacters(value);
      } catch (error) {
        console.error("Error in onCharacters:", error);
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
    };
  }, []);
};
