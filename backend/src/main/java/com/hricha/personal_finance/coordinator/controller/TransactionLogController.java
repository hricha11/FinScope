package com.hricha.personal_finance.coordinator.controller;

import com.hricha.personal_finance.coordinator.model.TransactionLog;
import com.hricha.personal_finance.coordinator.repository.TransactionLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tx/logs")
public class TransactionLogController {

    private final TransactionLogRepository logRepo;

    public TransactionLogController(TransactionLogRepository logRepo) {
        this.logRepo = logRepo;
    }

    @GetMapping
    public ResponseEntity<?> getAllLogs() {
        List<TransactionLog> logs = logRepo.findAll();
        return ResponseEntity.ok(
                logs.stream().map(this::toDto).toList()
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getLogsForUser(@PathVariable("userId") Long userId) {
        List<TransactionLog> logs = logRepo.findByUserId(userId);
        return ResponseEntity.ok(
                logs.stream().map(this::toDto).toList()
        );
    }

    @GetMapping("/{txId}")
    public ResponseEntity<?> getLogsForTx(@PathVariable("txId") String txId) {
        List<TransactionLog> logs = logRepo.findByTxId(txId);
        return ResponseEntity.ok(
                logs.stream().map(this::toDto).toList()
        );
    }

    private Map<String, Object> toDto(TransactionLog log) {
        var m = new HashMap<String, Object>();
        m.put("id", log.getId());
        m.put("txId", log.getTxId());
        m.put("userId", log.getUserId());
        m.put("status", log.getStatus());
        // reason can be null — HashMap allows null values
        m.put("reason", log.getReason());
        return m;
    }
}
