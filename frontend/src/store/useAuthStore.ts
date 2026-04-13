import { create } from "zustand";

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuth: Boolean;
    setUser: (user: User | null) => void;
    checkAuth: () => Promise<void>;
    logout: () => void;
    hasNewMessage: boolean;
    setHasNewMessage: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuth: false,

    setUser: (user) => set({user, isAuth: !!user}),

    checkAuth: async () => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/me", {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                set({ user: data, isAuth: true});
            } else {
                set({user:null, isAuth: false});
            }
        } catch (e) {
            set({user: null, isAuth: false });
        }
    },
    hasNewMessage: false,
    setHasNewMessage: (val) => set({hasNewMessage: val}),

    logout: () => set({ user:null, isAuth: false }),
}));