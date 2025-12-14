package com.hricha.personal_finance.prediction.controller;
import com.hricha.personal_finance.prediction.service.PredictionService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/predict")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> predict() {
        System.out.println(">>> PredictionController HIT");
        Double result = predictionService.predict();
        return ResponseEntity.ok(Map.of("predictedAmount", result));
    }

}
