package com.hricha.personal_finance.goal.repository;

import com.hricha.personal_finance.goal.model.LoanPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

public interface LoanPlanRepository extends JpaRepository<LoanPlan, Long> {
    Optional<LoanPlan> findByGoalId(Long goalId);
    List<LoanPlan> findByGoalIdIn(List<Long> goalIds);

    @Query("select coalesce(sum(l.emiAmount),0) from LoanPlan l where l.goalId in ?1")
    Double sumEmiByGoalIds(List<Long> goalIds);
}
