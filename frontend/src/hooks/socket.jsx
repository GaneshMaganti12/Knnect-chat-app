import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:4000";

export function useSocket(userId) {
  const socketRef = useRef();

  useEffect(() => {
    if (userId) {
      socketRef.current = io(ENDPOINT);
      socketRef.current.emit("setup", userId);
      socketRef.current.on("User connected", () =>
        console.log("socket connected")
      );
    }
  }, [userId]);

  const onEvent = (event, data) => {
    socketRef.current.on(event, data);
  };

  const emitEvent = (event, data) => {
    socketRef.current.emit(event, data);
  };

  const offEvent = (event) => {
    socketRef.current.off(event);
  };

  return { onEvent, emitEvent, offEvent };
}
