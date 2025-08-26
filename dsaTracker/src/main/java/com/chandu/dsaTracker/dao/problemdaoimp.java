package com.chandu.dsaTracker.dao;

import com.chandu.dsaTracker.model.Problem;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class problemdaoimp implements Problemdao{


    EntityManager entityManager;

    @Autowired
    problemdaoimp(EntityManager entityManager){
        this.entityManager=entityManager;
    }


    @Override
    public Problem add_problem(Problem problem) {
        entityManager.persist(problem);
        return problem;
    }

    @Override
    public List<Problem> get_problems(){
        TypedQuery<Problem> query=entityManager.createQuery("from Problem",Problem.class);
        List<Problem> list=query.getResultList();
        return list;
    }


    @Override
    public Problem get_problem(long id){
         return entityManager.find(Problem.class,id);
    }

    @Override
    public Problem update(long id, Problem updatedEvent) {

        Problem existingProblem = get_problem(id);
        if (existingProblem == null) {
            throw new EntityNotFoundException("Event with ID " + id + " not found");
        }
        existingProblem.setTitle(updatedEvent.getTitle());
        existingProblem.setProblem_url(updatedEvent.getProblem_url());
        existingProblem.setDifficulty(updatedEvent.getDifficulty());
        existingProblem.setDate_solved(updatedEvent.getDate_solved());
        existingProblem.setText(updatedEvent.getText());
        existingProblem.setVideo_link(updatedEvent.getVideo_link());
        existingProblem.setPattern(updatedEvent.getPattern());

        return entityManager.merge(updatedEvent);
    }

    @Override
    public Problem delete(long id){
        Problem problem=get_problem(id);
        entityManager.remove(problem);
        return problem;
    }

    @Override
    public List<Problem> get_by_pattern(String pattern){
        return entityManager
                .createQuery("SELECT p FROM Problem p WHERE p.pattern = :pattern", Problem.class)
                .setParameter("pattern", pattern)
                .getResultList();
    }

    @Override
    public List<Problem> getByDifficulty(String difficulty){
        return entityManager
                .createQuery("SELECT p FROM Problem p WHERE p.difficulty = :difficulty", Problem.class)
                .setParameter("difficulty", difficulty)
                .getResultList();
    }

    public List<Problem> findByTitle(String title) {
        String jpql = "SELECT p FROM Problem p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%'))";
        TypedQuery<Problem> query = entityManager.createQuery(jpql, Problem.class);
        query.setParameter("title", title);
        return query.getResultList();
    }


}
