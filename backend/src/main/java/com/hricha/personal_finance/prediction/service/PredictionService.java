package com.hricha.personal_finance.prediction.service;

import com.hricha.personal_finance.transaction.model.Transaction;
import com.hricha.personal_finance.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final RestTemplate restTemplate;
    private final TransactionRepository transactionRepository;

    public Double predict(Long userId) {

        System.out.println(">>> PredictionService HIT");

        // 1️⃣ Fetch REAL transactions from DB
        List<Transaction> transactions =
                transactionRepository.findByUserIdOrderByDateAsc(userId);

        if (transactions.size() < 5) {
            throw new RuntimeException("Not enough data for prediction");
        }

        // 2️⃣ Aggregate amount per date (IMPORTANT for Prophet)
        Map<LocalDate, Double> dailyTotals =
                transactions.stream()
                        .collect(Collectors.groupingBy(
                                Transaction::getDate,
                                Collectors.summingDouble(Transaction::getAmount)
                        ));

        // 3️⃣ Convert to Prophet payload format
        List<Map<String,Object>> payload =
                dailyTotals.entrySet()
                        .stream()
                        .map(e -> {
                            Map<String, Object> map = new HashMap<>();
                            map.put("date", e.getKey().toString());
                            map.put("amount", e.getValue());
                            return map;
                        })
                        .toList();

        // 4️⃣ Call Python service
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Map<String, Object>>> request =
                new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        "http://localhost:5000/predict",
                        request,
                        Map.class
                );

        return Double.parseDouble(
                response.getBody().get("prediction").toString()
        );
    }
}
