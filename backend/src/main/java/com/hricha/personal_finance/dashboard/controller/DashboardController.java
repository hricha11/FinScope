
package com.hricha.personal_finance.dashboard.controller;

import com.hricha.personal_finance.dashboard.dto.DashboardResponse;
import com.hricha.personal_finance.dashboard.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // GET /api/dashboard/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long userId) {
        DashboardResponse resp = dashboardService.getDashboardForUser(userId);
        return ResponseEntity.ok(resp);
    }
}
