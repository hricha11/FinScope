package com.hricha.personal_finance.transaction.controller;

import com.hricha.personal_finance.transaction.model.Transaction;
import com.hricha.personal_finance.transaction.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ===== DTOs =====

    public static class CreateTransactionRequest {
        public Long userId;
        public Double amount;
        public String date;       // yyyy-MM-dd
        public String time;       // HH:mm
        public String description;
        public String category;
    }

    // ===== APIs =====

    // POST /api/transactions
    @PostMapping
    public ResponseEntity<?> createTransaction(
            @RequestBody CreateTransactionRequest req
    ) {
        Transaction tx = transactionService.createTransaction(
                req.userId,
                req.amount,
                req.date,
                req.time,
                req.description,
                req.category
        );

        return ResponseEntity.ok(Map.of(
                "id", tx.getId(),
                "amount", tx.getAmount(),
                "category", tx.getCategory()
        ));
    }

    // GET /api/transactions?userId=1
    @GetMapping
    public ResponseEntity<?> getTransactions(
            @RequestParam Long userId
    ) {
        List<Transaction> transactions =
                transactionService.getTransactionsByUser(userId);

        return ResponseEntity.ok(transactions);
    }

    // DELETE /api/transactions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
            @PathVariable Long id
    ) {
        transactionService.deleteTransaction(id);

        return ResponseEntity.ok(Map.of(
                "status", "DELETED"
        ));
    }
}
