import { useEffect } from "react";
import socket from "./socket";

const SocketIO = () => {
  useEffect(() => {
    return () => {
      // Don't disconnect here! Keep connection alive
    };
  }, []);

  return null;
};

export default SocketIO;
export { socket };