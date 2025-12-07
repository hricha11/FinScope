package com.hricha.personal_finance.budget.service;

import com.hricha.personal_finance.budget.model.BudgetAllocation;
import com.hricha.personal_finance.budget.model.PendingBudgetChange;
import com.hricha.personal_finance.budget.repository.BudgetAllocationRepository;
import com.hricha.personal_finance.budget.repository.PendingBudgetChangeRepository;
import com.hricha.personal_finance.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetAllocationRepository budgetRepo;
    private final PendingBudgetChangeRepository pendingRepo;
    private final UserService userService;

    public BudgetService(BudgetAllocationRepository budgetRepo,
                         PendingBudgetChangeRepository pendingRepo,
                         UserService userService) {
        this.budgetRepo = budgetRepo;
        this.pendingRepo = pendingRepo;
        this.userService = userService;
    }

    public List<BudgetAllocation> getBudgetForUser(Long userId) {
        return budgetRepo.findByUserId(userId);
    }

    // 🔹 2PC COMMIT: apply all pending changes to real budget
    @Transactional
    public void commit(String txId) {
        var pendingChanges = pendingRepo.findByTxId(txId);

        for (PendingBudgetChange change : pendingChanges) {
            BudgetAllocation allocation = budgetRepo
                    .findByUserIdAndCategory(change.getUserId(), change.getCategory())
                    .orElseGet(() -> BudgetAllocation.builder()
                            .userId(change.getUserId())
                            .category(change.getCategory())
                            .amount(0.0)
                            .build());

            double newAmount = (allocation.getAmount() != null ? allocation.getAmount() : 0.0)
                    + change.getDeltaAmount();

            allocation.setAmount(newAmount);
            budgetRepo.save(allocation);
        }

        // Clear pending rows after successful commit
        pendingRepo.deleteAll(pendingChanges);
    }

    // 🔹 2PC PREPARE: check EMI rule + stage change in pending table
    @Transactional
    public boolean prepareChange(String txId, Long userId, String category, Double deltaAmount, Double income2) {
        if (deltaAmount == null) {
            return false;
        }

        // Get current income
        var incomeOpt = userService.getIncome(userId);
        Double income = incomeOpt.map(i -> i.getMonthlyIncome()).orElse(null);

        // Only enforce EMI rule on EMI category
        double newEmi = 0.0;
        if ("EMI".equalsIgnoreCase(category)) {
            var existingEmiOpt = budgetRepo.findByUserIdAndCategory(userId, "EMI");
            double currentEmi = existingEmiOpt
                    .map(a -> a.getAmount() != null ? a.getAmount() : 0.0)
                    .orElse(0.0);

            newEmi = currentEmi + deltaAmount;

            // Rule: EMI must not exceed 40% of income
            if (income != null) {
                double maxAllowedEmi = income * 0.4;
                if (newEmi > maxAllowedEmi) {
                    return false;
                }
            }
        }

        // Stage the change (for any category)
        PendingBudgetChange pending = PendingBudgetChange.builder()
                .txId(txId)
                .userId(userId)
                .category(category.toUpperCase())
                .deltaAmount(deltaAmount)
                .build();

        pendingRepo.save(pending);
        return true;
    }

    // 🔹 2PC ROLLBACK: discard staged changes
    @Transactional
    public void rollback(String txId) {
        var pendingChanges = pendingRepo.findByTxId(txId);
        pendingRepo.deleteAll(pendingChanges);
    }

    // 🔹 Normal "direct set" for manual editing
    @Transactional
    public BudgetAllocation setCategoryAmount(Long userId, String category, Double amount) {
        BudgetAllocation allocation = budgetRepo
                .findByUserIdAndCategory(userId, category.toUpperCase())
                .orElseGet(() -> BudgetAllocation.builder()
                        .userId(userId)
                        .category(category.toUpperCase())
                        .build());

        allocation.setAmount(amount);
        return budgetRepo.save(allocation);
    }
}
