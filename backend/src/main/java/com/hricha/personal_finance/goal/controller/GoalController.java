package com.hricha.personal_finance.goal.controller;

import com.hricha.personal_finance.goal.model.Goal;
import com.hricha.personal_finance.goal.model.LoanPlan;
import com.hricha.personal_finance.goal.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final LoanService loanService;

    public GoalController(LoanService loanService) {
        this.loanService = loanService;
    }

    // DTOs
    public static class CreateGoalRequest {
        public Long userId;
        public String name;
        public Double targetAmount;
        public Integer targetMonths;
    }

    public static class CreateLoanPlanRequest {
        public Long goalId;
        public Double principal;
        public Double interestRate;
        public Integer tenureMonths;
    }
    public static class PrepareLoanRequest {
        public String txId;
        public Long userId;
        public Long goalId;
        public Double principal;
        public Double interestRate;
        public Integer tenureMonths;
    }

    public static class TxIdRequest {
        public String txId;
    }

    // POST /api/goals/loan/prepare
    @PostMapping("/loan/prepare")
    public ResponseEntity<?> prepareLoan(@RequestBody PrepareLoanRequest req) {
        boolean ready = loanService.prepareLoanChange(
                req.txId,
                req.userId,
                req.goalId,
                req.principal,
                req.interestRate,
                req.tenureMonths
        );

        return ResponseEntity.ok(Map.of(
                "ready", ready
        ));
    }
    // POST /api/goals/loan/commit
    @PostMapping("/loan/commit")
    public ResponseEntity<?> commitLoan(@RequestBody TxIdRequest req) {
        loanService.commit(req.txId);
        return ResponseEntity.ok(Map.of(
                "status", "COMMITTED"
        ));
    }
    // POST /api/goals/loan/rollback
    @PostMapping("/loan/rollback")
    public ResponseEntity<?> rollbackLoan(@RequestBody TxIdRequest req) {
        loanService.rollback(req.txId);
        return ResponseEntity.ok(Map.of(
                "status", "ROLLEDBACK"
        ));
    }
    @PostMapping
    public ResponseEntity<?> createGoal(@RequestBody CreateGoalRequest req) {
        Goal goal = loanService.createGoal(req.userId, req.name, req.targetAmount, req.targetMonths);

        return ResponseEntity.ok(Map.of(
                "id", goal.getId(),
                "name", goal.getName()
        ));
    }

    @PostMapping("/loan")
    public ResponseEntity<?> createLoanPlan(@RequestBody CreateLoanPlanRequest req) {
        LoanPlan plan = loanService.createLoanPlan(req.goalId, req.principal, req.interestRate, req.tenureMonths);

        return ResponseEntity.ok(Map.of(
                "goalId", plan.getGoalId(),
                "emi", plan.getEmiAmount()
        ));
    }

    @GetMapping("/{goalId}/loan")
    public ResponseEntity<?> getLoanPlan(@PathVariable Long goalId) {
        LoanPlan plan = loanService.getLoanPlan(goalId);

        return ResponseEntity.ok(Map.of(
                "goalId", plan.getGoalId(),
                "emi", plan.getEmiAmount()
        ));
    }
}
