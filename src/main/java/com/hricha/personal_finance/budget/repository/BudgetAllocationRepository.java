package com.hricha.personal_finance.budget.repository;

import com.hricha.personal_finance.budget.model.BudgetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetAllocationRepository extends JpaRepository<BudgetAllocation, Long> {

    List<BudgetAllocation> findByUserId(Long userId);

    Optional<BudgetAllocation> findByUserIdAndCategory(Long userId, String category);
}
