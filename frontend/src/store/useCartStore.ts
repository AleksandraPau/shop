import { create } from 'zustand';
import { getCart, addToCart } from '@/api/cart';

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        image?: string;
    };
}

interface CartState {
    items:CartItem[];
    totalItems: number;
    fetchCart: () => Promise<void>;
    addItem: (productId: number, quanyity?: number) => Promise<void>;
    clearCart: () => void;
    clearCartAll: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    totalItems: 0,

    fetchCart: async () => {
        try {
            const data = await getCart();
            const items = data.items || [];
            set({
                items,
                totalItems: items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0)
            });
        } catch (error) {
            console.error("Ошибка загрузки корзины", error)
        }
    },

    addItem: async (productId: number, quantity = 1) => {
        try {
            await addToCart(productId, quantity);
            const data = await getCart();
            const items = data.items || [];
            set({
                items,
                totalItems: items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0)
            })
        } catch (error) {
            alert("Нужно войти в аккаунт, чтобы добавить товар!");
        }
    },

    clearCart: () => set({ items: [], totalItems: 0}),

    clearCartAll: async () => {
        try {
            const response = await fetch("http://localhost:3000/api/cart/clear", {
                method: "DELETE",
                credentials: "include"
            });

            if (response.ok) {
                set({items: [], totalItems: 0});
            }
        } catch (error) {
            console.error("Ошибка при очистке:", error);
            
        }
    },
    
}));