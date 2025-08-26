package com.chandu.dsaTracker.Service;


import com.chandu.dsaTracker.dao.problemdaoimp;
import com.chandu.dsaTracker.model.Problem;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {

    problemdaoimp problemdaoimp;

    @Autowired
    public ProblemService(problemdaoimp problemdaoimp){
        this.problemdaoimp=problemdaoimp;
    }

    public Problem add_problem(Problem problem){
        return problemdaoimp.add_problem(problem);
    }

    public List<Problem> get_problems(){
        return problemdaoimp.get_problems();
    }

    public Problem get_problem(long id){
        return problemdaoimp.get_problem(id);
    }

    public Problem update(long id,Problem problem){
        return problemdaoimp.update(id,problem);
    }

    public Problem delete(long id){
        return problemdaoimp.delete(id);
    }

    public List<Problem> get_by_pattern(String pattern){
        return problemdaoimp.get_by_pattern(pattern);
    }

    public List<Problem> get_by_difficulty(String difficulty){
        return problemdaoimp.getByDifficulty(difficulty);
    }

    public List<Problem> find_by_title(String title){
        return problemdaoimp.findByTitle(title);
    }

}
