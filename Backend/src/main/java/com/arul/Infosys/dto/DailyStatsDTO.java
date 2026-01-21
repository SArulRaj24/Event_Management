package com.arul.Infosys.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyStatsDTO {
    private LocalDate date;
    private Long count;      // New registrations on this day
    private Long cumulative; // Total registrations up to this day
}