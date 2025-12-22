const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  category: string;
  badgeEn?: string;
  badgeAr?: string;
  imageUrl?: string;
  featuresEn: string[];
  featuresAr: string[];
  isFeatured: boolean;
  isActive: boolean;
}

interface SubscriptionPlan {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  monthlyPrice: number;
  annualPrice?: number;
  savings?: number;
  mealsPerMonth: number;
  featuresEn: string[];
  featuresAr: string[];
  isPopular: boolean;
  isActive: boolean;
}

interface CreateOrderData {
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    gender?: string;
  };
  orderType: 'one-time' | 'subscription';
  items: Array<{
    productId?: string;
    subscriptionPlanId?: string;
    quantity: number;
  }>;
  dietaryPreferences?: string[];
  specialNotes?: string;
  deliveryFrequency?: string;
  shippingAddress?: Record<string, string>;
  paymentMethod: 'cod';
  sessionId?: string;
}

interface OrderResult {
  orderNumber: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  // Products
  async getProducts(category?: string): Promise<Product[]> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const response = await request<{ success: boolean; data: Product[] }>(`/products${params}`);
    return response.data;
  },

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await request<{ success: boolean; data: SubscriptionPlan[] }>('/subscription-plans');
    return response.data;
  },

  // Orders
  async createOrder(data: CreateOrderData): Promise<OrderResult> {
    const response = await request<{ success: boolean; data: OrderResult }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async trackOrder(orderNumber: string) {
    const response = await request<{ success: boolean; data: unknown }>(`/orders/${orderNumber}`);
    return response.data;
  },

  // Checkout tracking
  async trackCheckoutSession(data: {
    sessionId: string;
    currentStep: number;
    cartState: object;
    personalInfo?: object;
    checkoutInfo?: object;
  }): Promise<void> {
    await request('/checkout/session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async trackCheckoutAbandonment(sessionId: string, abandonedAtStep: number): Promise<void> {
    await request('/checkout/abandon', {
      method: 'POST',
      body: JSON.stringify({ sessionId, abandonedAtStep }),
    });
  },

  async completeCheckoutSession(sessionId: string, orderId: string): Promise<void> {
    await request('/checkout/complete', {
      method: 'POST',
      body: JSON.stringify({ sessionId, orderId }),
    });
  },
};

export type { Product, SubscriptionPlan, CreateOrderData, OrderResult };
