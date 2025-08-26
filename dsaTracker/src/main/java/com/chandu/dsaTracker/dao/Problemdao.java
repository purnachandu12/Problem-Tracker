package com.chandu.dsaTracker.dao;

import com.chandu.dsaTracker.model.Problem;

import java.util.List;

public interface Problemdao {
    Problem add_problem(Problem problem);
    List<Problem> get_problems();
    Problem get_problem(long id);
    Problem update(long id, Problem updatedEvent);
    Problem delete(long id);
    List<Problem> get_by_pattern(String pattern);
    List<Problem> getByDifficulty(String difficulty);
    List<Problem> findByTitle(String title);
}
