package com.hricha.personal_finance.budget.repository;


import com.hricha.personal_finance.budget.model.PendingBudgetChange;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hricha.personal_finance.budget.repository.PendingBudgetChangeRepository;

import java.util.List;

public interface PendingBudgetChangeRepository extends JpaRepository<PendingBudgetChange, Long> {

    List<PendingBudgetChange> findByTxId(String txId);
}
