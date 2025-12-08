package com.hricha.personal_finance.budget.repository;

import com.hricha.personal_finance.budget.model.BudgetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BudgetAllocationRepository extends JpaRepository<BudgetAllocation, Long> {

    List<BudgetAllocation> findByUserId(Long userId);

    Optional<BudgetAllocation> findByUserIdAndCategory(Long userId, String category);
    @Query("select coalesce(sum(b.amount), 0) from BudgetAllocation b where b.userId = :userId")
    Double sumByUserId(Long userId);
}
