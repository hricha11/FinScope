
import api from './axios'
import { Transaction } from '../types'

// GET all transactions for a user
export const getTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  const res = await api.get(`/api/transactions?userId=${userId}`)
  return res.data
}

// CREATE transaction
export const createTransaction = async (
  userId: string,
  amount: number,
  date: string,
  time: string,
  category?: string,
  description?: string
): Promise<Transaction> => {
  const res = await api.post(`/api/transactions`, {
    userId,
    amount,
    date,
    time,
    category,
    description,
  })
  return res.data
}

// DELETE transaction
export const deleteTransaction = async (
  transactionId: number
): Promise<void> => {
  await api.delete(`/api/transactions/${transactionId}`)
}


