
import api from './axios'

export const addIncome = async (userId: string, monthlyIncome: number) => {
  const res = await api.post(`/api/users/${userId}/income`, {
    monthlyIncome,
  })

  return res.data
}
