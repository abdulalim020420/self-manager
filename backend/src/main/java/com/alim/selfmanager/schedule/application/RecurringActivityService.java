package com.alim.selfmanager.schedule.application;

import com.alim.selfmanager.common.exception.InvalidScheduleException;
import com.alim.selfmanager.common.exception.ResourceNotFoundException;
import com.alim.selfmanager.common.exception.ScheduleConflictException;
import com.alim.selfmanager.common.security.CurrentUserProvider;
import com.alim.selfmanager.schedule.domain.RecurringActivity;
import com.alim.selfmanager.schedule.infrastructure.RecurringActivityRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;

@Service
public class RecurringActivityService {

    private final RecurringActivityRepository repository;
    private final CurrentUserProvider currentUserProvider;

    public RecurringActivityService(RecurringActivityRepository repository, CurrentUserProvider currentUserProvider) {
        this.repository = repository;
        this.currentUserProvider = currentUserProvider;
    }

    public List<RecurringActivity> getAll() {
        return repository.findByUserId(currentUserProvider.getCurrentUserId());
    }

    public RecurringActivity getById(Long id) {
        RecurringActivity activity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring activity not found with id " + id));
        checkOwnership(activity);
        return activity;
    }

    public List<RecurringActivity> getByDayOfWeek(DayOfWeek day) {
        return repository.findByUserIdAndDayOfWeek(currentUserProvider.getCurrentUserId(), day);
    }

    public RecurringActivity create(RecurringActivity activity) {
        activity.setUserId(currentUserProvider.getCurrentUserId());
        validateTimeRange(activity);
        checkForConflicts(activity, null);
        return repository.save(activity);
    }

    public RecurringActivity update(Long id, RecurringActivity updated) {
        RecurringActivity existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring activity not found with id " + id));
        checkOwnership(existing);
        updated.setId(id);
        updated.setUserId(existing.getUserId());
        validateTimeRange(updated);
        checkForConflicts(updated, id);
        return repository.save(updated);
    }

    public void delete(Long id) {
        RecurringActivity existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurring activity not found with id " + id));
        checkOwnership(existing);
        repository.deleteById(id);
    }

    private void checkOwnership(RecurringActivity activity) {
        if (!activity.getUserId().equals(currentUserProvider.getCurrentUserId())) {
            throw new ResourceNotFoundException("Recurring activity not found with id " + activity.getId());
        }
    }

    private void validateTimeRange(RecurringActivity activity) {
        if (!activity.getStartTime().isBefore(activity.getEndTime())) {
            throw new InvalidScheduleException("Start time must be before end time");
        }
    }

    private void checkForConflicts(RecurringActivity activity, Long excludeId) {
        List<RecurringActivity> sameDay = repository.findByUserIdAndDayOfWeek(
                currentUserProvider.getCurrentUserId(), activity.getDayOfWeek());
        for (RecurringActivity existing : sameDay) {
            if (existing.getId().equals(excludeId)) continue;
            boolean overlaps = activity.getStartTime().isBefore(existing.getEndTime())
                    && existing.getStartTime().isBefore(activity.getEndTime());
            if (overlaps) {
                throw new ScheduleConflictException(
                        "Overlaps with existing '" + existing.getTitle() + "' (" +
                                existing.getStartTime() + "-" + existing.getEndTime() + ") on " + activity.getDayOfWeek());
            }
        }
    }
}