package com.alim.selfmanager.schedule.api;


import com.alim.selfmanager.schedule.application.ScheduleResolverService;
import com.alim.selfmanager.schedule.domain.ScheduleSlot;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/calendar")
public class CalendarController {

    private final ScheduleResolverService resolverService;

    public CalendarController(ScheduleResolverService resolverService) {
        this.resolverService = resolverService;
    }

    @GetMapping("/{date}")
    public List<ScheduleSlot> getSchedule(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return resolverService.getScheduleForDate(date);
    }
}
