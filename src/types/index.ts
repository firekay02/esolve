export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'agent' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerId: string;
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'agent';
  timestamp: Date;
  isSystem?: boolean;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}