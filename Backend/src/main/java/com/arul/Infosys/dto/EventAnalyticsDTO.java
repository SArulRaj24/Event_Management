package com.arul.Infosys.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class EventAnalyticsDTO {
    private Integer totalRegistrations;
    private Integer maxCapacity;
    private List<DailyStatsDTO> dailyStats;
}