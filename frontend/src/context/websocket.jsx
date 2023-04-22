import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const WebsocketContext = createContext([false, null, () => { }]);


// Make sure to put WebsocketProvider higher up in
// the component tree than any consumers.
export const WebsocketProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);

  const ws = useRef(null);

  useEffect(() => {
    const socket = io("ws://localhost:7001");
    socket.on("connect", () => {
      console.log('ws ready')
      setIsReady(true);
    })

    socket.on("disconnect", () => {
      console.log('ws close')
      setIsReady(false);
    });

    socket.on("data", (data) => {
      setVal(data);
    })

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const ret = [isReady, val, ws.current?.emit.bind(ws.current)];
  return (
    <WebsocketContext.Provider value={ret}>
      {children}
    </WebsocketContext.Provider>
  );
};