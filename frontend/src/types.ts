export interface BudgetAllocation {
  category: string
  amount: number
}
export interface Transaction {
  id: number
  amount: number
  date: string
  time: string
  category?: string
  description?: string
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  months: number
  status?: string
}

export interface TransactionLog {
  txId: string
  status: string
  reason?: string
  createdAt?: string
}

export interface DashboardResponse {
  userId?: string
  monthlyIncome: number
  totalAllocated: number
  emiAllocation: number
  availableForSavings: number
  budgets: BudgetAllocation[]
  goals: Goal[]
  recentTransactions: TransactionLog[]
}

export interface LoanPlanPayload {
  userId: string
  goalId: string
  principal: number
  interestRate: number
  tenureMonths: number
}

export interface UserProfile {
  id?: string
  name?: string
  email: string
}


