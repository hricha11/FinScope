import api from './axios'
import { DashboardResponse, TransactionLog } from '../types'

export const fetchDashboard = async (userId: string | number) => {
  const { data } = await api.get<DashboardResponse>(`/api/dashboard/${userId}`)
  return data
}

export const fetchTransactions = async (userId: string | number) => {
  const { data } = await api.get<TransactionLog[]>(`/api/tx/logs/user/${userId}`)
  return data
}


