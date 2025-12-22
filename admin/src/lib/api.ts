const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the request
        (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
        const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include',
        });
        return retryResponse.json();
      }
      throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/auth/admin/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        this.accessToken = null;
        return false;
      }

      const data = await response.json();
      this.accessToken = data.data.accessToken;
      return true;
    } catch {
      this.accessToken = null;
      return false;
    }
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{
      success: boolean;
      data: { accessToken: string; user: { id: string; email: string; firstName: string; lastName: string; role: string } };
    }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.accessToken = response.data.accessToken;
    return response.data;
  }

  async logout() {
    await this.request('/auth/admin/logout', { method: 'POST' });
    this.accessToken = null;
  }

  async getProfile() {
    return this.request<{ success: boolean; data: { id: string; email: string; firstName: string; lastName: string; role: string } }>('/auth/admin/me');
  }

  // Products
  async getProducts(params?: { page?: number; limit?: number; category?: string; isActive?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (typeof params?.isActive === 'boolean') searchParams.set('isActive', params.isActive.toString());

    return this.request<{ success: boolean; data: Product[]; pagination: Pagination }>(`/admin/products?${searchParams}`);
  }

  async getProduct(id: string) {
    return this.request<{ success: boolean; data: Product }>(`/admin/products/${id}`);
  }

  async createProduct(data: Partial<Product>) {
    return this.request<{ success: boolean; data: Product }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: Partial<Product>) {
    return this.request<{ success: boolean; data: Product }>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Subscription Plans
  async getSubscriptionPlans(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    return this.request<{ success: boolean; data: SubscriptionPlan[]; pagination: Pagination }>(`/admin/subscription-plans?${searchParams}`);
  }

  async createSubscriptionPlan(data: Partial<SubscriptionPlan>) {
    return this.request<{ success: boolean; data: SubscriptionPlan }>('/admin/subscription-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubscriptionPlan(id: string, data: Partial<SubscriptionPlan>) {
    return this.request<{ success: boolean; data: SubscriptionPlan }>(`/admin/subscription-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubscriptionPlan(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/subscription-plans/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(params?: { page?: number; limit?: number; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);

    return this.request<{ success: boolean; data: Order[]; pagination: Pagination }>(`/admin/orders?${searchParams}`);
  }

  async getOrder(id: string) {
    return this.request<{ success: boolean; data: Order }>(`/admin/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string, notes?: string) {
    return this.request<{ success: boolean; data: Order }>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async getOrderStats() {
    return this.request<{ success: boolean; data: OrderStats }>('/admin/orders/stats');
  }

  // Customers
  async getCustomers(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    return this.request<{ success: boolean; data: Customer[]; pagination: Pagination }>(`/admin/customers?${searchParams}`);
  }

  async getCustomer(id: string) {
    return this.request<{ success: boolean; data: Customer }>(`/admin/customers/${id}`);
  }

  async getCustomerStats() {
    return this.request<{ success: boolean; data: CustomerStats }>('/admin/customers/stats');
  }
}

export const api = new ApiClient();

// Types
export interface Product {
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
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
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
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  orderType: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress?: Record<string, unknown>;
  dietaryPrefs: string[];
  specialNotes?: string;
  deliveryFreq?: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  items?: OrderItem[];
  tracking?: DeliveryTracking[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  subscriptionPlanId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
  subscriptionPlan?: SubscriptionPlan;
}

export interface DeliveryTracking {
  id: string;
  orderId: string;
  status: string;
  location?: string;
  notes?: string;
  trackedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  isGuest: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
    subscriptions: number;
  };
  totalSpent?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderStats {
  orders: {
    today: number;
    week: number;
    month: number;
    total: number;
    pending: number;
  };
  revenue: {
    today: number;
    month: number;
  };
  byStatus: Record<string, number>;
}

export interface CustomerStats {
  total: number;
  newToday: number;
  newThisMonth: number;
  guests: number;
  activeSubscriptions: number;
}
