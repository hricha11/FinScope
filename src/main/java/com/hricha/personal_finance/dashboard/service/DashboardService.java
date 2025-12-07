package com.hricha.personal_finance.dashboard.service;

import com.hricha.personal_finance.budget.model.BudgetAllocation;
import com.hricha.personal_finance.budget.repository.BudgetAllocationRepository;
import com.hricha.personal_finance.coordinator.model.TransactionLog;
import com.hricha.personal_finance.coordinator.repository.TransactionLogRepository;
import com.hricha.personal_finance.dashboard.dto.DashboardResponse;
import com.hricha.personal_finance.goal.model.Goal;
import com.hricha.personal_finance.goal.model.LoanPlan;
import com.hricha.personal_finance.goal.repository.GoalRepository;
import com.hricha.personal_finance.goal.repository.LoanPlanRepository;
import com.hricha.personal_finance.user.model.Income;
import com.hricha.personal_finance.user.repository.IncomeRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final IncomeRepository incomeRepo;
    private final BudgetAllocationRepository budgetRepo;
    private final GoalRepository goalRepo;
    private final LoanPlanRepository loanPlanRepo;
    private final TransactionLogRepository logRepo;

    public DashboardService(IncomeRepository incomeRepo,
                            BudgetAllocationRepository budgetRepo,
                            GoalRepository goalRepo,
                            LoanPlanRepository loanPlanRepo,
                            TransactionLogRepository logRepo) {
        this.incomeRepo = incomeRepo;
        this.budgetRepo = budgetRepo;
        this.goalRepo = goalRepo;
        this.loanPlanRepo = loanPlanRepo;
        this.logRepo = logRepo;
    }

    /**
     * Build an aggregated dashboard view for a given user.
     */
    public DashboardResponse getDashboardForUser(Long userId) {
        DashboardResponse out = new DashboardResponse();

        // 1) monthly income (default 0.0)
        Optional<Income> incomeOpt = incomeRepo.findByUserId(userId);
        double income = incomeOpt.map(i -> i.getMonthlyIncome() != null ? i.getMonthlyIncome() : 0.0).orElse(0.0);
        out.monthlyIncome = income;

        // 2) budget allocations & total allocated
        List<BudgetAllocation> allocations = budgetRepo.findByUserId(userId);
        double totalAllocated = allocations.stream()
                .mapToDouble(a -> a.getAmount() != null ? a.getAmount() : 0.0)
                .sum();
        out.totalBudgetAllocated = totalAllocated;

        // 3) budget breakdown (category, amount, pctOfIncome)
        List<Map<String, Object>> breakdown = allocations.stream()
                .map(a -> {
                    double amt = a.getAmount() != null ? a.getAmount() : 0.0;
                    double pct = income > 0 ? Math.round((amt / income) * 10000.0) / 100.0 : 0.0; // two decimals
                    Map<String, Object> m = new HashMap<>();
                    m.put("category", a.getCategory());
                    m.put("amount", amt);
                    m.put("pctOfIncome", pct);
                    return m;
                })
                .collect(Collectors.toList());
        out.budgetBreakdown = breakdown;

        // 4) EMI allocation specifically
        double emiAllocation = allocations.stream()
                .filter(a -> "EMI".equalsIgnoreCase(a.getCategory()))
                .mapToDouble(a -> a.getAmount() != null ? a.getAmount() : 0.0)
                .sum();
        out.emiAllocation = emiAllocation;

        // 5) available for savings (income - totalAllocated), clamp to zero
        out.availableForSavings = Math.max(0.0, income - totalAllocated);

        // 6) goals & simple goal DTOs
        List<Goal> goals = goalRepo.findByUserId(userId);
        out.activeGoalsCount = goals.size();
        List<Map<String, Object>> goalDtos = goals.stream().map(g -> {
            Map<String, Object> gm = new HashMap<>();
            gm.put("id", g.getId());
            gm.put("name", g.getName());
            gm.put("targetAmount", g.getTargetAmount());
            gm.put("targetMonths", g.getTargetMonths());
            return gm;
        }).collect(Collectors.toList());
        out.goals = goalDtos;

        // 7) loan plans associated with these goals
        List<Long> goalIds = goals.stream().map(Goal::getId).collect(Collectors.toList());
        List<LoanPlan> loans = goalIds.isEmpty() ? Collections.emptyList() : loanPlanRepo.findByGoalIdIn(goalIds);
        out.activeLoansCount = loans.size();
        double totalEmi = loans.stream().mapToDouble(l -> l.getEmiAmount() != null ? l.getEmiAmount() : 0.0).sum();
        out.totalEmi = totalEmi;

        // 8) recent transactions (last 10) for user
        List<TransactionLog> txs = logRepo.findByUserId(userId);
        List<Map<String, Object>> recent = txs.stream()
                .sorted(Comparator.comparing(TransactionLog::getId).reversed())
                .limit(10)
                .map(t -> {
                    Map<String, Object> tm = new HashMap<>();
                    tm.put("txId", t.getTxId());
                    tm.put("status", t.getStatus());
                    tm.put("reason", t.getReason()); // can be null
                    return tm;
                })
                .collect(Collectors.toList());
        out.recentTransactions = recent;

        // 9) health flags
        Map<String, Boolean> health = new HashMap<>();
        health.put("overBudget", totalAllocated > income);
        health.put("emiTooHigh", income > 0 && emiAllocation > income * 0.4);
        health.put("hasActiveLoans", out.activeLoansCount != null && out.activeLoansCount > 0);
        out.health = health;

        return out;
    }
}
