package com.hms.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        try {
            jdbcTemplate.queryForObject("select 1", Integer.class);

            Map<String, String> response = new LinkedHashMap<String, String>();
            response.put("status", "UP");
            response.put("database", "UP");

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Map<String, String> response = new LinkedHashMap<String, String>();
            response.put("status", "DOWN");
            response.put("database", "DOWN");
            response.put("message", ex.getMessage() == null ? "Database connection failed." : ex.getMessage());

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}
