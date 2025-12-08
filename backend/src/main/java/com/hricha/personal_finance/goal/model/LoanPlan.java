package com.hricha.personal_finance.goal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loan_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long goalId;

    private Double principal;

    private Double interestRate;

    private Integer tenureMonths;

    private Double emiAmount;
}
