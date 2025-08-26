A DSA (Data Structures and Algorithms) Tracker web application that helps students and developers organize, track, and practice DSA problems.
It provides an easy-to-use interface to add, update, and view problems by pattern and difficulty, making consistent practice more structured.

Features:
1)Add new DSA problems with details (title, description, pattern, difficulty, link, status).
2) View problems categorized by pattern (e.g., DP, Greedy, Graph, etc.).
3) Filter problems by difficulty (Easy, Medium, Hard).
4) Update or delete problems as needed.
5) Search functionality for quick access.
6) Track your progress efficiently.

Tech Stack:
Backend: Spring Boot
Database: MySQL
Frontend:html,css,js
Tools: Postman, Git, REST APIs

Api EndPoints:
POST   /api/problems                → Add a new problem  
GET    /api/problems                 → Get all problems  
GET    /api/problems/{id}            → Get problem by ID  
POST   /api/problems/{id}            → Update a problem  
DELETE /api/problems/{id}            → Delete a problem  
GET    /api/pattern/{pattern}        → Get problems by pattern  
GET    /api/difficulty/{difficulty}  → Get problems by difficulty  
