package com.hricha.personal_finance.coordinator.controller;

import com.hricha.personal_finance.coordinator.service.CoordinatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tx")
public class CoordinatorController {

    private final CoordinatorService coordinatorService;

    public CoordinatorController(CoordinatorService coordinatorService) {
        this.coordinatorService = coordinatorService;
    }

    public static class LoanTxRequest {
        public Long userId;
        public Long goalId;
        public Double principal;
        public Double interestRate;
        public Integer tenureMonths;
    }

    @PostMapping("/start-loan-plan")
    public ResponseEntity<?> startLoan(@RequestBody LoanTxRequest req) {

        String status = coordinatorService.startLoanTransaction(
                req.userId,
                req.goalId,
                req.principal,
                req.interestRate,
                req.tenureMonths
        );

        return ResponseEntity.ok(Map.of(
                "transactionStatus", status
        ));
    }
}
