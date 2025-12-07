package com.hricha.personal_finance.budget.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pending_budget_changes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingBudgetChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Transaction identifier from coordinator
    private String txId;

    private Long userId;

    private String category;      // e.g. "EMI"

    private Double deltaAmount;   // e.g. +25000
}
