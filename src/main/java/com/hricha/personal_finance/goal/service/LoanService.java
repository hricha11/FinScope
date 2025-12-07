package com.hricha.personal_finance.goal.service;

import com.hricha.personal_finance.goal.model.PendingLoanChange;
import com.hricha.personal_finance.goal.repository.PendingLoanChangeRepository;

import com.hricha.personal_finance.goal.model.Goal;
import com.hricha.personal_finance.goal.model.LoanPlan;
import com.hricha.personal_finance.goal.repository.GoalRepository;
import com.hricha.personal_finance.goal.repository.LoanPlanRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoanService {

    private final GoalRepository goalRepo;
    private final LoanPlanRepository loanRepo;
    private final PendingLoanChangeRepository pendingRepo;

    public LoanService(GoalRepository goalRepo,
                       LoanPlanRepository loanRepo,
                       PendingLoanChangeRepository pendingRepo) {
        this.goalRepo = goalRepo;
        this.loanRepo = loanRepo;
        this.pendingRepo = pendingRepo;
    }

    // ⭐ PUBLIC EMI CALCULATION (used by coordinator)
    public double calculateEmi(double principal, double annualRate, int tenureMonths) {
        double monthlyRate = (annualRate / 12) / 100;
        return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))
                / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    }

    // Create goal normally
    @Transactional
    public Goal createGoal(Long userId, String name, Double targetAmount, Integer targetMonths) {
        Goal goal = Goal.builder()
                .userId(userId)
                .name(name)
                .targetAmount(targetAmount)
                .targetMonths(targetMonths)
                .build();

        return goalRepo.save(goal);
    }


    // ⭐ FIXED: SAFE PREPARE — NO EXCEPTIONS
    @Transactional
    public boolean prepareLoanChange(String txId,
                                     Long userId,
                                     Long goalId,
                                     Double principal,
                                     Double rate,
                                     Integer tenureMonths) {

        // Basic validation
        if (principal == null || principal <= 0 ||
                rate == null || rate <= 0 ||
                tenureMonths == null || tenureMonths <= 0) {
            return false;
        }

        // SAFE lookup — NO throw
        Goal goal = goalRepo.findById(goalId).orElse(null);
        if (goal == null) {
            return false;
        }

        // Must belong to user
        if (!goal.getUserId().equals(userId)) {
            return false;
        }

        double emi = calculateEmi(principal, rate, tenureMonths);

        PendingLoanChange pending = PendingLoanChange.builder()
                .txId(txId)
                .userId(userId)
                .goalId(goalId)
                .principal(principal)
                .interestRate(rate)
                .tenureMonths(tenureMonths)
                .emiAmount(emi)
                .build();

        pendingRepo.save(pending);
        return true;
    }


    // ⭐ COMMIT — Convert pending change → Final LoanPlan
    @Transactional
    public void commit(String txId) {
        var pendingChanges = pendingRepo.findByTxId(txId);

        for (PendingLoanChange change : pendingChanges) {
            LoanPlan plan = LoanPlan.builder()
                    .goalId(change.getGoalId())
                    .principal(change.getPrincipal())
                    .interestRate(change.getInterestRate())
                    .tenureMonths(change.getTenureMonths())
                    .emiAmount(change.getEmiAmount())
                    .build();

            loanRepo.save(plan);
        }

        pendingRepo.deleteAll(pendingChanges);
    }


    // ⭐ ROLLBACK — Delete staged changes
    @Transactional
    public void rollback(String txId) {
        var pendingChanges = pendingRepo.findByTxId(txId);
        pendingRepo.deleteAll(pendingChanges);
    }


    // Normal creation (not 2PC)
    @Transactional
    public LoanPlan createLoanPlan(Long goalId, Double principal, Double rate, Integer tenure) {

        Goal goal = goalRepo.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        double emi = calculateEmi(principal, rate, tenure);

        LoanPlan plan = LoanPlan.builder()
                .goalId(goal.getId())
                .principal(principal)
                .interestRate(rate)
                .tenureMonths(tenure)
                .emiAmount(emi)
                .build();

        return loanRepo.save(plan);
    }

    // Fetch committed loan plan
    public LoanPlan getLoanPlan(Long goalId) {
        return loanRepo.findByGoalId(goalId)
                .orElseThrow(() -> new RuntimeException("Loan plan not found"));
    }
}
