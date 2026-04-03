import { useEffect, useRef, useState } from "react";
import { WS_URL } from "../api/client";

export default function useWebSocket() {
  const [alerts, setAlerts] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(WS_URL);
      ws.current.onopen = () => console.log("WebSocket connected");
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "breaking_change") {
          setAlerts((prev) => [data, ...prev].slice(0, 10));
        }
      };
      ws.current.onclose = () => setTimeout(connect, 3000);
      ws.current.onerror = () => ws.current.close();
    };
    connect();
    return () => ws.current?.close();
  }, []);

  const dismissAlert = (index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  return { alerts, dismissAlert };
}
