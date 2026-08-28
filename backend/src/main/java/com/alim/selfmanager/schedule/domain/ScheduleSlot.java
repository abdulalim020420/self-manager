package com.alim.selfmanager.schedule.domain;

import java.time.LocalTime;

public class ScheduleSlot {

    private String title;
    private String description;
    private LocalTime startTime;
    private LocalTime endTime;
    private String source; // "RECURRING" or "EVENT"

    public ScheduleSlot(){}

    public ScheduleSlot(String title, String description, LocalTime startTime, LocalTime endTime, String source){
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.source = source;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
