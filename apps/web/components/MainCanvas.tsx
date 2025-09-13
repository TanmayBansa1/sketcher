"use client";
import { useEffect, useState } from "react";
import CustomCanvas from "./CustomCanvas";

interface MainCanvasProps {
  roomSlug: string;
  token: string;
  wsUrl: string;
}

export default function MainCanvas({ roomSlug, token, wsUrl }: MainCanvasProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

      useEffect(() => {        
        if (!roomSlug || !token || !wsUrl) {
          console.log('Missing roomSlug, token, or wsUrl, skipping WebSocket connection');
          return;
        }
        
        console.log('Connecting to WebSocket:', wsUrl);
        
        const socket = new WebSocket(
          `${wsUrl}/?token=${token}`
        );
        setSocket(socket);
        socket.onopen = () => {
          console.log('WebSocket connected, joining room:', roomSlug);
          socket.send(
            JSON.stringify({
              type: "join_room",
              roomSlug: roomSlug,
            })
          );
        };
      }, [roomSlug, token, wsUrl]);

    return (
      <CustomCanvas roomSlug={roomSlug} socket={socket}/>
    ) 
}