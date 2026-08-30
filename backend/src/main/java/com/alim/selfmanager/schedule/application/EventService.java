package com.alim.selfmanager.schedule.application;


import com.alim.selfmanager.common.exception.InvalidScheduleException;
import com.alim.selfmanager.common.exception.ResourceNotFoundException;
import com.alim.selfmanager.common.exception.ScheduleConflictException;
import com.alim.selfmanager.common.security.CurrentUserProvider;
import com.alim.selfmanager.schedule.domain.Event;
import com.alim.selfmanager.schedule.infrastructure.EventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;
    private final CurrentUserProvider currentUserProvider;

    public EventService(EventRepository repository, CurrentUserProvider currentUserProvider) {
        this.repository = repository;
        this.currentUserProvider = currentUserProvider;
    }

    public List<Event> getAll() {
        return repository.findByUserId(currentUserProvider.getCurrentUserId());
    }

    public Event getById(Long id) {
        Event event = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
        checkOwnership(event);
        return event;
    }

    public List<Event> getByDate(LocalDate date) {
        return repository.findByUserIdAndDate(currentUserProvider.getCurrentUserId(), date);
    }

    public Event create(Event event) {
        event.setUserId(currentUserProvider.getCurrentUserId());
        validateTimeRange(event);
        checkForConflicts(event, null);
        return repository.save(event);
    }

    public Event update(Long id, Event updated) {
        Event existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
        checkOwnership(existing);
        updated.setId(id);
        updated.setUserId(existing.getUserId());
        validateTimeRange(updated);
        checkForConflicts(updated, id);
        return repository.save(updated);
    }

    public void delete(Long id) {
        Event existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
        checkOwnership(existing);
        repository.deleteById(id);
    }

    private void checkOwnership(Event event) {
        if (!event.getUserId().equals(currentUserProvider.getCurrentUserId())) {
            throw new ResourceNotFoundException("Event not found with id " + event.getId());
        }
    }

    private void validateTimeRange(Event event) {
        if (!event.getStartTime().isBefore(event.getEndTime())) {
            throw new InvalidScheduleException("Start time must be before end time");
        }
    }

    private void checkForConflicts(Event event, Long excludeId) {
        List<Event> sameDate = repository.findByUserIdAndDate(currentUserProvider.getCurrentUserId(), event.getDate());
        for (Event existing : sameDate) {
            if (existing.getId().equals(excludeId)) continue;
            boolean overlaps = event.getStartTime().isBefore(existing.getEndTime())
                    && existing.getStartTime().isBefore(event.getEndTime());
            if (overlaps) {
                throw new ScheduleConflictException(
                        "Overlaps with existing event '" + existing.getTitle() + "' (" +
                                existing.getStartTime() + "-" + existing.getEndTime() + ") on " + event.getDate());
            }
        }
    }
}