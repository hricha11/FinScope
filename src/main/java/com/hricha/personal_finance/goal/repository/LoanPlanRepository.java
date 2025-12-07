package com.hricha.personal_finance.goal.repository;

import com.hricha.personal_finance.goal.model.LoanPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoanPlanRepository extends JpaRepository<LoanPlan, Long> {
    Optional<LoanPlan> findByGoalId(Long goalId);
}
