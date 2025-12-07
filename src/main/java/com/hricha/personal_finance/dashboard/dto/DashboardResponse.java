package com.hricha.personal_finance.dashboard.dto;

import java.util.List;
import java.util.Map;

public class DashboardResponse {
    public Double monthlyIncome;
    public Double totalBudgetAllocated;
    public Double emiAllocation;
    public Double availableForSavings;
    public List<Map<String, Object>> budgetBreakdown; // each: { category, amount, pct }
    public Integer activeGoalsCount;
    public List<Map<String, Object>> goals; // each: { id, name, targetAmount, targetMonths }
    public Integer activeLoansCount;
    public Double totalEmi; // sum of EMI
    public List<Map<String, Object>> recentTransactions; // {txId, status, reason}
    public Map<String, Boolean> health;
}