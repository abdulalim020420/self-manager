package com.alim.selfmanager.schedule.application;


import com.alim.selfmanager.common.exception.InvalidScheduleException;
import com.alim.selfmanager.common.exception.ResourceNotFoundException;
import com.alim.selfmanager.common.exception.ScheduleConflictException;
import com.alim.selfmanager.schedule.domain.Event;
import com.alim.selfmanager.schedule.infrastructure.EventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository){
        this.repository = repository;
    }

    public List<Event> getAll(){
        return repository.findAll();
    }

    public Event getById(Long id){
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
    }

    public List<Event> getByDate(LocalDate date){
        return repository.findByDate(date);
    }

    public Event create(Event event){
        validateTimeRange(event);
        checkForConflicts(event, null);
        return repository.save(event);
    }

    public Event update(Long id, Event updated){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id " + id);
        }
        validateTimeRange(updated);
        updated.setId(id);
        checkForConflicts(updated, id);
        return repository.save(updated);
    }

    public void delete(Long id){
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id " + id);
        }
        repository.deleteById(id);
    }

    private void validateTimeRange(Event event) {
        if (!event.getStartTime().isBefore(event.getEndTime())) {
            throw new InvalidScheduleException("Start time must be before end time");
        }
    }

    private void checkForConflicts(Event event, Long excludeId) {
        List<Event> sameDate = repository.findByDate(event.getDate());
        for (Event existing : sameDate) {
            if (existing.getId().equals(excludeId)) {
                continue; // skip itself when updating
            }
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