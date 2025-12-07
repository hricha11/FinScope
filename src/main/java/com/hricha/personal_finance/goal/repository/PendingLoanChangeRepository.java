package com.hricha.personal_finance.goal.repository;

import com.hricha.personal_finance.goal.model.PendingLoanChange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PendingLoanChangeRepository extends JpaRepository<PendingLoanChange, Long> {

    List<PendingLoanChange> findByTxId(String txId);
}
