package com.hricha.personal_finance.prediction.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final RestTemplate restTemplate;

    public Double predict() {
         System.out.println(">>> PredictionService HIT");
        // TEMP payload (until DB wiring)
        List<Map<String, Object>> payload = List.of(
                Map.of("date", "2025-01-01", "amount", 1200),
                Map.of("date", "2025-01-05", "amount", 1500),
                Map.of("date", "2025-02-01", "amount", 1800),
                Map.of("date", "2025-02-10", "amount", 1700),
                Map.of("date", "2025-03-01", "amount", 2000),
                Map.of("date", "2025-03-15", "amount", 2200),
                Map.of("date", "2025-04-01", "amount", 2400),
                Map.of("date", "2025-04-10", "amount", 2600),
                Map.of("date", "2025-05-01", "amount", 2800),
                Map.of("date", "2025-05-10", "amount", 3000)
        );

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
