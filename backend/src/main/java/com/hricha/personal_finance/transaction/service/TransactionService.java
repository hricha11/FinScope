package com.hricha.personal_finance.transaction.service;

import com.hricha.personal_finance.transaction.model.Transaction;
import com.hricha.personal_finance.transaction.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction createTransaction(
            Long userId,
            Double amount,
            String date,
            String time,
            String description,
            String category
    ) {
        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setDate(LocalDate.parse(date));
        tx.setTime(LocalTime.parse(time));
        tx.setDescription(description);
        tx.setCategory(category);

        return transactionRepository.save(tx);
    }

    public List<Transaction> getTransactionsByUser(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
