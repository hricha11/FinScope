package com.hricha.personal_finance.transaction.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record TransactionDTO(
        Long id,
        Double amount,
        LocalDate date,
        LocalTime time,
        String description,
        String category
) {}