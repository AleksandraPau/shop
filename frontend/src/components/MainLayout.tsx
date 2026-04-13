import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false });

export const MainLayout = () => {
    const { user, setHasNewMessage } = useAuthStore();

    const fetchCart = useCartStore((state) => state.fetchCart);
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
        fetchCart();
    }, []);

    useEffect(() => {
        if (!user?.id) return;

        socket.auth = {userId: user.id };
        socket.connect();

        const handleMessage = (msg) => {
            if (window.location.pathname !== '/support') {
                setHasNewMessage(true);
            }
        };
        socket.on("server_message", handleMessage);
    
        return () => {
            socket.off("server_message", handleMessage);
            socket.disconnect();
        };
    }, [user?.id]);

 

    return (
        <>
            <Header />
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Сюда будут «подставляться» компоненты Dashboard, Cart и т.д. */}
        <Outlet />
      </main>
        </>
    );
};