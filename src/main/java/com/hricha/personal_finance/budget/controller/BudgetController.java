package com.hricha.personal_finance.budget.controller;
import com.hricha.personal_finance.budget.model.BudgetAllocation;
import com.hricha.personal_finance.budget.service.BudgetService;
import com.hricha.personal_finance.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/budget")
public class BudgetController {
    private final BudgetService budgetService;
    public BudgetController(BudgetService budgetService, UserService userService) {
        this.budgetService = budgetService;
    }
    public static class SetBudgetRequest {
        public String category;
        public Double amount;
    }
    // NEW: request bodies for 2PC
    public static class PrepareBudgetRequest {
        public String txId;
        public Long userId;
        public String category;
        public Double deltaAmount;
    }

    public static class TxIdRequest {
        public String txId;
    }

    // GET /api/budget/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<?> getBudget(@PathVariable Long userId) {
        List<BudgetAllocation> allocations = budgetService.getBudgetForUser(userId);

        return ResponseEntity.ok(
                allocations.stream()
                        .map(a -> Map.of(
                                "id", a.getId(),
                                "userId", a.getUserId(),
                                "category", a.getCategory(),
                                "amount", a.getAmount()
                        ))
                        .toList()
        );
    }

    // POST /api/budget/{userId}
    @PostMapping("/{userId}")
    public ResponseEntity<?> setBudgetCategory(@PathVariable Long userId,
                                               @RequestBody SetBudgetRequest req) {
        BudgetAllocation allocation = budgetService.setCategoryAmount(userId, req.category, req.amount);

        return ResponseEntity.ok(Map.of(
                "id", allocation.getId(),
                "userId", allocation.getUserId(),
                "category", allocation.getCategory(),
                "amount", allocation.getAmount()
        ));
    }

    // 🔹 POST /api/budget/prepare
    @PostMapping("/prepare")
    public ResponseEntity<?> prepare(@RequestBody PrepareBudgetRequest req) {
        boolean ready = budgetService.prepareChange(
                req.txId,
                req.userId,
                req.category,
                req.deltaAmount, null
        );

        return ResponseEntity.ok(Map.of(
                "ready", ready
        ));
    }

    // 🔹 POST /api/budget/commit
    @PostMapping("/commit")
    public ResponseEntity<?> commit(@RequestBody TxIdRequest req) {
        budgetService.commit(req.txId);
        return ResponseEntity.ok(Map.of(
                "status", "COMMITTED"
        ));
    }

    // 🔹 POST /api/budget/rollback
    @PostMapping("/rollback")
    public ResponseEntity<?> rollback(@RequestBody TxIdRequest req) {
        budgetService.rollback(req.txId);
        return ResponseEntity.ok(Map.of(
                "status", "ROLLEDBACK"
        ));
    }
}
