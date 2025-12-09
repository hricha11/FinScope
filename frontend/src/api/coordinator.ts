import api from './axios'
import { LoanPlanPayload, TransactionLog } from '../types'

export const startLoanPlan = async (payload: LoanPlanPayload) => {
  const { data } = await api.post('/api/tx/start-loan-plan', payload)
  return data
}

export const fetchTransactionLogs = async (userId: string | number) => {
  const { data } = await api.get<TransactionLog[]>(`/api/tx/logs/user/${userId}`)
  return data
}


