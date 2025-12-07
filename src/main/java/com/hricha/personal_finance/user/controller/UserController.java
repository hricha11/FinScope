package com.hricha.personal_finance.user.controller;

import com.hricha.personal_finance.user.model.Income;
import com.hricha.personal_finance.user.model.User;
import com.hricha.personal_finance.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Request DTOs
    public static class CreateUserRequest {
        public String name;
        public String email;
    }

    public static class SetIncomeRequest {
        public Double monthlyIncome;
    }

    // POST /api/users
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest req) {
        User user = userService.createUser(req.name, req.email);

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }

    // POST /api/users/{userId}/income
    @PostMapping("/{userId}/income")
    public ResponseEntity<?> setIncome(@PathVariable Long userId,
                                       @RequestBody SetIncomeRequest req) {
        Income income = userService.setMonthlyIncome(userId, req.monthlyIncome);

        return ResponseEntity.ok(Map.of(
                "userId", income.getUserId(),
                "monthlyIncome", income.getMonthlyIncome()
        ));
    }

    // GET /api/users/{userId}/income
    @GetMapping("/{userId}/income")
    public ResponseEntity<?> getIncome(@PathVariable Long userId) {
        return userService.getIncome(userId)
                .<ResponseEntity<?>>map(income -> ResponseEntity.ok(Map.of(
                        "userId", income.getUserId(),
                        "monthlyIncome", income.getMonthlyIncome()
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
