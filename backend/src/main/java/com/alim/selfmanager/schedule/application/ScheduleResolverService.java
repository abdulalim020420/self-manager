package com.alim.selfmanager.schedule.application;

import com.alim.selfmanager.schedule.domain.Event;
import com.alim.selfmanager.schedule.domain.RecurringActivity;
import com.alim.selfmanager.schedule.domain.ScheduleSlot;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ScheduleResolverService {

    private final RecurringActivityService recurringActivityService;
    private final EventService eventService;

    public ScheduleResolverService(RecurringActivityService recurringActivityService, EventService eventService){
        this.recurringActivityService = recurringActivityService;
        this.eventService = eventService;
    }

    public List<ScheduleSlot> getScheduleForDate(LocalDate date){
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        List<RecurringActivity> activities = recurringActivityService.getByDayOfWeek(dayOfWeek);
        List<Event> events = eventService.getByDate(date);

        List<ScheduleSlot> result = new ArrayList<>();

        //For each activity trim away any event cover
        for (RecurringActivity activity : activities) {
            List<LocalTime[]> remainingRanges = new ArrayList<>();
            remainingRanges.add(new LocalTime[]{activity.getStartTime(), activity.getEndTime()});

            for (Event event : events){
                remainingRanges = trimRanges(remainingRanges, event.getStartTime(), event.getEndTime());
            }

            for (LocalTime[] range : remainingRanges) {
                result.add(new ScheduleSlot(activity.getTitle(), activity.getDescription(), range[0], range[1], "RECURRING"));
            }
        }

        //EVENT ALWAYS SHOW IN FULL
        for (Event event : events) {
            result.add(new ScheduleSlot(event.getTitle(), event.getDescription(), event.getStartTime(), event.getEndTime(), "EVENT"));
        }

        result.sort(Comparator.comparing(ScheduleSlot::getStartTime));
        return result;
    }


    //CUTS eventStart - eventEnd out of each range, returning what's left (0,1 or 2 pieces per range)
    private List<LocalTime[]> trimRanges(List<LocalTime[]> ranges, LocalTime eventStart, LocalTime eventEnd) {
        List<LocalTime[]> trimmed = new ArrayList<>();

        for (LocalTime[] range : ranges) {
            LocalTime aStart = range[0];
            LocalTime aEnd = range[1];

            boolean overlaps = aStart.isBefore(eventEnd) && eventStart.isBefore(aEnd);

            if(!overlaps) {
                trimmed.add(range); //case 1: untouched
                continue;
            }

            if(!eventStart.isAfter(aStart) && !eventEnd.isBefore(aEnd)) {
                continue;  // case 2 : fully covered, drop it
            }

            if(!eventStart.isAfter(aStart)) {
                trimmed.add(new LocalTime[]{eventEnd, aEnd}); //case 3 : eats the start
                continue;
            }

            if(!eventEnd.isBefore(aEnd)) {
                trimmed.add(new LocalTime[]{aStart, eventStart}); //case 4 : eats the end
                continue;
            }

            //Case 5 : event between fully recurring activity, split into two section
            trimmed.add(new LocalTime[]{aStart, eventStart});
            trimmed.add(new LocalTime[]{eventEnd, aEnd});
        }
        return trimmed;
    }

}
