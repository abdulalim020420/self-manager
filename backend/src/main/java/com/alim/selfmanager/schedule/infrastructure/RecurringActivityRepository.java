package com.alim.selfmanager.schedule.infrastructure;

import com.alim.selfmanager.schedule.domain.RecurringActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface RecurringActivityRepository extends JpaRepository<RecurringActivity, Long> {
    List<RecurringActivity> findByUserId(Long userId);
    List<RecurringActivity> findByUserIdAndDayOfWeek(Long userId, DayOfWeek dayOfWeek);
}