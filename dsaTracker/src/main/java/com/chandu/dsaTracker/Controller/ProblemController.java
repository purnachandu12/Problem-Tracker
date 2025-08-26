package com.chandu.dsaTracker.Controller;

import com.chandu.dsaTracker.Service.ProblemService;
import com.chandu.dsaTracker.model.Problem;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ProblemController {

    ProblemService problemService;

    ProblemController(ProblemService problemService){
        this.problemService=problemService;
    }

    @PostMapping("/problems")
    public Problem add_problem(@RequestBody Problem problem){
        return problemService.add_problem(problem);
    }

    @GetMapping("/problems")
    public List<Problem> get_problems(){
        return problemService.get_problems();
    }

    @GetMapping("/problems/{id}")
    public Problem get_problem(@PathVariable long id){
        return problemService.get_problem(id);
    }

    @PostMapping("/problems/{id}")
    public Problem update_problem(@PathVariable long id,@RequestBody Problem problem){
        return problemService.update(id,problem);
    }

    @DeleteMapping("/problems/{id}")
    public Problem delete_problem(@PathVariable long id){
        return problemService.delete(id);
    }

    @GetMapping("/pattern/{pattern}")
    public List<Problem> getProblemsByPattern(@PathVariable String pattern) {
        return problemService.get_by_pattern(pattern);
    }

    @GetMapping("/difficulty/{difficulty}")
    public List<Problem> getProblemsByDifficulty(@PathVariable String difficulty) {
        return problemService.get_by_difficulty(difficulty);
    }

    @GetMapping("/problem/{title}")
    public List<Problem> get_by_title(@PathVariable String title){
        return problemService.find_by_title(title);
    }

}
