package com.hricha.personal_finance.coordinator.repository;

import com.hricha.personal_finance.coordinator.model.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long> {

    List<TransactionLog> findByUserId(Long userId);

    List<TransactionLog> findByTxId(String txId);
}
