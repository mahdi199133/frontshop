import { Order, CartItem, Discount } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = (token: string) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };
};

interface DiscountApplyBody {
    code: string;
    cart: { product_id: number; quantity: number }[];
}

interface DiscountApplyResponse {
    original_price: string;
    discount_applied: Discount;
    discount_amount: string;
    final_price: string;
}

export const applyDiscount = async (token: string, body: DiscountApplyBody): Promise<DiscountApplyResponse> => {
    const response = await fetch(`${API_BASE_URL}/discounts/apply/`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply discount');
    }
    return response.json();
};
