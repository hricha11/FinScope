package com.hricha.personal_finance.coordinator.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transaction_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String txId;

    private Long userId;

    private String status; 
    private String reason; // if failed
}
