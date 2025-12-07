package com.hricha.personal_finance.coordinator.controller;

import com.hricha.personal_finance.coordinator.model.TransactionLog;
import com.hricha.personal_finance.coordinator.repository.TransactionLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tx/logs")
public class TransactionLogController {

    private final TransactionLogRepository logRepo;

    public TransactionLogController(TransactionLogRepository logRepo) {
        this.logRepo = logRepo;
    }

    // GET /api/tx/logs
    @GetMapping
    public ResponseEntity<?> getAllLogs() {
        List<TransactionLog> logs = logRepo.findAll();
        return ResponseEntity.ok(
                logs.stream().map(this::toDto).toList()
        );
    }

    // GET /api/tx/logs/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getLogsForUser(@PathVariable Long userId) {
        List<TransactionLog> logs = logRepo.findByUserId(userId);
        return ResponseEntity.ok(
                logs.stream().map(this::toDto).toList()
        );
    }

    // GET /api/tx/logs/{txId}
    @GetMapping("/{txId}")
    public ResponseEntity<?> getLogsForTx(@PathVariable String txId) {
        List<TransactionLog> logs = logRepo.findByTxId(txId);
        return ResponseEntity.ok(
                logs.stream().map(this::toDto).toList()
        );
    }

    private Map<String, Object> toDto(TransactionLog log) {
        return Map.of(
                "id", log.getId(),
                "txId", log.getTxId(),
                "userId", log.getUserId(),
                "status", log.getStatus(),
                "reason", log.getReason()
        );
    }
}
