import { createContext, useState, useEffect, useRef } from "react";


export const WebsocketContext = createContext([false, null, () => {}]);


// Make sure to put WebsocketProvider higher up in
// the component tree than any consumers.
export const WebsocketProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);

  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:7001");

    socket.onopen = () => {
        console.log('ws ready')
        setIsReady(true);
    }
    socket.onclose = () => {
        console.log('ws close')
        setIsReady(false);
    }
    socket.onmessage = (event) => setVal(event.data);

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const ret = [isReady, val, ws.current?.send.bind(ws.current)];
  return (
    <WebsocketContext.Provider value={ret}>
      {children}
    </WebsocketContext.Provider>
  );
};