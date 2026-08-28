package com.alim.selfmanager.schedule.api;

import com.alim.selfmanager.schedule.application.RecurringActivityService;
import com.alim.selfmanager.schedule.domain.RecurringActivity;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/recurring-activities")
public class RecurringActivityController {

    private final RecurringActivityService service;

    public RecurringActivityController(RecurringActivityService service){
        this.service = service;
    }

    @GetMapping
    public List<RecurringActivity> getAll(){
        return service.getAll();
    }

    @GetMapping("/day/{day}")
    public List <RecurringActivity> getByDay(@PathVariable DayOfWeek day){
        return service.getByDayOfWeek(day);
    }

    @GetMapping("/{id}")
    public RecurringActivity getById(@PathVariable Long id){
        return service.getById(id);
    }

    @PostMapping
    public RecurringActivity create(@Valid @RequestBody RecurringActivity activity){
        return service.create(activity);
    }

    @PutMapping("/{id}")
    public RecurringActivity update(@PathVariable Long id, @Valid @RequestBody RecurringActivity activity){
        return service.update(id, activity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
