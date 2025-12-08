package com.hricha.personal_finance.budget.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "budget_allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String category; // e.g. "RENT", "FOOD", "EMI", "SAVINGS"

    private Double amount;
}