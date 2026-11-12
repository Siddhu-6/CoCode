import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

export const createSocketClient = () => {
    if (API_URL) return io(API_URL);
    if (import.meta.env.DEV) return io({ path: "/api/socket.io" });
    return io();
};
