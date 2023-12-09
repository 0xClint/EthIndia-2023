import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const socket = io(process.env.REACT_APP_TEMP_URL);
export const charactersAtom = atom([]);
export const idAtom = atom([]);
export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [myid, setMyid] = useAtom(idAtom);
  useEffect(() => {
    function onConnect() {
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

    function onCharacters(value) {
      setCharacters(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
    };
  }, []);
};
