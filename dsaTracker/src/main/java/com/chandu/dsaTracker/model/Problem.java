package com.chandu.dsaTracker.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name="problem")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String problem_url;
    private String difficulty;
    private Date date_solved;
    private String text;
    private String video_link;
    private String pattern;

    public Problem(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProblem_url() {
        return problem_url;
    }

    public void setProblem_url(String problem_url) {
        this.problem_url = problem_url;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Date getDate_solved() {
        return date_solved;
    }

    public void setDate_solved(Date date_solved) {
        this.date_solved = date_solved;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getVideo_link() {
        return video_link;
    }

    public void setVideo_link(String video_link) {
        this.video_link = video_link;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    @Override
    public String toString() {
        return "problem{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", problem_url='" + problem_url + '\'' +
                ", difficulty='" + difficulty + '\'' +
                ", date_solved=" + date_solved +
                ", text='" + text + '\'' +
                ", video_link='" + video_link + '\'' +
                ", pattern='" + pattern + '\'' +
                '}';
    }
}
