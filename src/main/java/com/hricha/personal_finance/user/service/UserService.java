package com.hricha.personal_finance.user.service;

import com.hricha.personal_finance.user.model.Income;
import com.hricha.personal_finance.user.model.User;
import com.hricha.personal_finance.user.repository.IncomeRepository;
import com.hricha.personal_finance.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hricha.personal_finance.user.service.UserService;
import com.hricha.personal_finance.user.service.UserService;


import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    

    public UserService(UserRepository userRepository, IncomeRepository incomeRepository) {
        this.userRepository = userRepository;
        this.incomeRepository = incomeRepository;
    }

    @Transactional
    public User createUser(String name, String email) {
        // Check if user already exists
        userRepository.findByEmail(email).ifPresent(u -> {
            throw new RuntimeException("User with this email already exists");
        });

        User user = User.builder()
                .name(name)
                .email(email)
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public Income setMonthlyIncome(Long userId, Double monthlyIncome) {
        // Ensure user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Income> existing = incomeRepository.findByUserId(user.getId());

        Income income = existing.orElseGet(() -> Income.builder()
                .userId(user.getId())
                .build());

        income.setMonthlyIncome(monthlyIncome);

        return incomeRepository.save(income);
    }

    public Optional<Income> getIncome(Long userId) {
        return incomeRepository.findByUserId(userId);
    }
}
