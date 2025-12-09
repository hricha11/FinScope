import api from './axios'
import { BudgetAllocation } from '../types'

export const getBudget = async (userId: string | number) => {
  const { data } = await api.get<BudgetAllocation[]>(`/api/budget/${userId}`)
  return data
}

export const setBudget = async (
  userId: string | number,
  category: string,
  amount: number,
) => {
  const { data } = await api.post<BudgetAllocation[]>(`/api/budget/${userId}`, {
    category,
    amount,
  })
  return data
}

export const prepareBudget = async (
  txId: string,
  userId: string | number,
  category: string,
  deltaAmount: number,
) => {
  const { data } = await api.post(`/api/budget/prepare`, {
    txId,
    userId,
    category,
    deltaAmount,
  })
  return data
}

export const commitBudget = async (txId: string) => {
  const { data } = await api.post(`/api/budget/commit`, { txId })
  return data
}


