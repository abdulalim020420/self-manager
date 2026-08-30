package com.alim.selfmanager.schedule.infrastructure;

import com.alim.selfmanager.schedule.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>{
    List <Event> findByUserId(Long userId);
    List <Event> findByUserIdAndDate(Long userId, LocalDate localDate);
}

