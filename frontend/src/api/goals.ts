import api from './axios'
import { Goal } from '../types'

export const createGoal = async (payload: {
  userId: number | string
  name: string
  targetAmount: number
  targetMonths: number
}) => {
  const { data } = await api.post<Goal>('/api/goals', payload)
  return data
}

// Backend does not expose a list-all endpoint. Caller should source goals from dashboard or provide explicit calls.
export const listGoals = async (userId: string | number) => {
  // Fallback: try dashboard-equivalent path; update if backend adds dedicated list.
  const { data } = await api.get<Goal[]>(`/api/dashboard/${userId}`)
  return (data as any).goals ?? []
}

export const getGoalById = async (id: string | number) => {
  const { data } = await api.get<Goal>(`/api/goals/${id}/loan`)
  return data
}


