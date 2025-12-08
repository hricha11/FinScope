package com.hricha.personal_finance.user.repository;


import com.hricha.personal_finance.user.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    Optional<Income> findByUserId(Long userId);
}
