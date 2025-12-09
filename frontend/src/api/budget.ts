import apiClient from "./client";
import { BudgetAllocation } from "../types";

export const getBudget = async (
  userId: string
): Promise<BudgetAllocation[]> => {
  const res = await apiClient.get(`/api/budget/${userId}`);
  return res.data;
};

export const setBudget = async (
  userId: string,
  category: string,
  amount: number
): Promise<void> => {
  await apiClient.post(`/api/budget/${userId}`, {
    category,
    amount,
  });
};

export const deleteBudget = async (
  userId: string,
  category: string
): Promise<void> => {
  await apiClient.delete(
    `/api/budget/${userId}/${encodeURIComponent(category)}`
  );
};

export const prepareBudget = async (
  txId: string,
  userId: string,
  category: string,
  amount: number
) => {
  return apiClient.post(`/api/budget/prepare`, {
    transactionId: txId,
    userId,
    category,
    amount,
  });
};

export const commitBudget = async (txId: string) => {
  return apiClient.post(`/api/budget/commit/${txId}`);
};
