import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";

export const MainLayout = () => {
    const fetchCart = useCartStore((state) => state.fetchCart);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

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