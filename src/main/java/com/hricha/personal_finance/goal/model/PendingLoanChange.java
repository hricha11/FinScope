package com.hricha.personal_finance.goal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pending_loan_changes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingLoanChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String txId;

    private Long userId;

    private Long goalId;

    private Double principal;

    private Double interestRate;

    private Integer tenureMonths;

    private Double emiAmount;
}
