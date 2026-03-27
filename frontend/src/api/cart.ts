import { API_BASE_URL, fetchOptions } from "./config";

export async function addToCart(productId: number, quantity: number = 1) {
    const response = await fetch(`${API_BASE_URL}/cart/add`, fetchOptions('POST', { productId, quantity }));
    if (!response.ok) throw new Error("Ошибка при добавлении");
    return await response.json();
}

export async function getCart() {
    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) throw new Error("не удалось загрузить корзину");
    return await response.json();
}