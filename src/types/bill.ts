export interface BillItem {
  id: number;
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  recurringType?: 'monthly' | 'weekly' | 'yearly' | 'custom';
  recurringInterval?: number;
  nextDueDate?: string;
  isPaid: boolean;
  accountId: number;
  userId: number;
  isOverdue: boolean;
  daysTillDue: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillRequest {
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  recurringType?: 'monthly' | 'weekly' | 'yearly' | 'custom';
  recurringInterval?: number;
  accountId: number;
}

export interface UpdateBillRequest extends CreateBillRequest {
  id: number;
  isPaid?: boolean;
}