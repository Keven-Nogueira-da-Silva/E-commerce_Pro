// ==================== AUTH ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
}

// ==================== PRODUCT ====================
export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  stockQuantity?: number;
  imageUrl?: string;
  category?: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  category?: string;
  createdAt: string;
}

// ==================== CART ====================
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CartItemResponse {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  id: number;
  items: CartItemResponse[];
  totalAmount: number;
  totalItems: number;
}

// ==================== ORDER ====================
export interface PaymentInfo {
  method: string;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface OrderRequest {
  shippingAddress: string;
  paymentInfo?: PaymentInfo;
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  items: OrderItemResponse[];
  payment?: PaymentResponse;
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// ==================== PAYMENT ====================
export interface PaymentResponse {
  id: number;
  amount: number;
  method: string;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate?: string;
}

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// ==================== PAGINATION ====================
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ==================== ERROR ====================
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
