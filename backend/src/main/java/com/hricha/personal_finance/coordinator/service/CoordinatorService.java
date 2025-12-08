package com.hricha.personal_finance.coordinator.service;

import com.hricha.personal_finance.budget.service.BudgetService;
import com.hricha.personal_finance.coordinator.model.TransactionLog;
import com.hricha.personal_finance.coordinator.repository.TransactionLogRepository;
import com.hricha.personal_finance.goal.service.LoanService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CoordinatorService {

    private final LoanService loanService;
    private final BudgetService budgetService;
    private final TransactionLogRepository logRepo;
    

    public CoordinatorService(LoanService loanService,
                              BudgetService budgetService,
                              TransactionLogRepository logRepo) {
        this.loanService = loanService;
        this.budgetService = budgetService;
        this.logRepo = logRepo;
    }

    public String startLoanTransaction(Long userId,
                                       Long goalId,
                                       Double principal,
                                       Double interestRate,
                                       Integer tenureMonths) {

        String txId = UUID.randomUUID().toString();

        // Log initiation
        logRepo.save(TransactionLog.builder()
                .txId(txId)
                .userId(userId)
                .status("INITIATED")
                .build());

        // 1️⃣ Prepare loan
        boolean loanReady = loanService.prepareLoanChange(
                txId,
                userId,
                goalId,
                principal,
                interestRate,
                tenureMonths
        );
        
        if (!loanReady) {
            loanService.rollback(txId);

            logRepo.save(TransactionLog.builder()
                    .txId(txId)
                    .userId(userId)
                    .status("ROLLEDBACK")
                    .reason("Loan prepare rejected")
                    .build());

            return "ROLLEDBACK";
        }
        double emi = loanService.calculateEmi(principal, interestRate, tenureMonths);

        // 2️⃣ Prepare budget with EMI
        boolean budgetReady = budgetService.prepareChange(
                txId,
                userId,
                "EMI",
                emi,
                null
        );

        if (!budgetReady) {
            loanService.rollback(txId);
            logRepo.save(TransactionLog.builder()
                    .txId(txId)
                    .userId(userId)
                    .status("ROLLEDBACK")
                    .reason("Budget prepare failed: EMI too high")
                    .build());
            return "ROLLEDBACK";
        }

        // 3️⃣ If both ready → commit
        loanService.commit(txId);
        budgetService.commit(txId);

        logRepo.save(TransactionLog.builder()
                .txId(txId)
                .userId(userId)
                .status("COMMITTED")
                .build());

        return "COMMITTED";
    }
}
