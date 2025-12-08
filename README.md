# StudyBuddy

A full stack web application ProtoType for coordinating university study groups. Students can browse course offerings, create groups, join groups, schedule sessions, and provide feedback.

The system is designed to demonstrate strong relational database design: indexing, triggers, foreign key constraints, and efficient join operations.

---

## Technical Focus

• SQL indexing  
• Multi table joins and nested queries  
• Relational integrity with foreign keys  
• Triggers to enforce scheduling constraints  
• REST API architecture  
• Pagination and filtered search  
• Session based authentication  
• Error handling and fail safe upsert logic

---

## Features

User registration and login authentication  
Discover course offerings and enroll  
Study group creation by course and term  
Join and leave groups  
Session scheduling with physical room conflicts prevented  
Survey feedback and aggregated summaries  
Fast search with query based filtering  
Backend routing and logging for debugging

---

## How to Run Locally

Requirements  
• XAMPP (Apache and MySQL)  
• Node.js and npm  

Steps

1. Clone the repository into XAMPP htdocs  

   Example path  
   /Applications/XAMPP/xamppfiles/htdocs/studdybuddy

2. Start Apache and MySQL from XAMPP

3. Create a database  
   Name: studdybuddy

4. Initialize schema and sample data  

   Run in browser or CLI:  
   http://localhost/studdybuddy/db/run_initial_sql.php  

   This creates tables, foreign keys, triggers, indexes, and inserts sample data.

5. Backend  

   API base URL:  
   http://localhost/studdybuddy/api  

   Main router file:  
   api/index.php

6. Frontend  

   In the frontend directory:  
   cd frontend  
   npm install  
   npm run dev  

   Frontend runs at:  
   http://localhost:5174  

CORS permissions on the backend are configured for the local development server on port 5174.

---

## System Architecture

Frontend  
• React with Axios for HTTP requests  
• Vite development server

Backend  
• PHP 8 running under Apache (XAMPP)  
• Custom routing in api/index.php, matching HTTP method and URI patterns  
• Handlers under api/handlers for individual endpoint logic

Database  
• MySQL or MariaDB with InnoDB engine  
• Relational schema with composite keys, foreign keys, triggers, and indexes

Data exchange  
• JSON formatted REST API responses and requests

---

## Database Entities

Main tables include:

• User  
• Course  
• Course_Offerings  
• Enrollment  
• StudyGroup  
• Joins  
• Session  
• Location  
• Survey_Questions  
• Survey_Feedback  

Each table is normalized to reduce redundancy and enforce clear relationships.

---

## Indexing Strategy

Indexes are created on columns that appear frequently in WHERE conditions and joins. This reduces full table scans and improves response time.

Target | Indexed Columns | Optimization goal
------ | --------------- | ----------------
User lookup | User.computingID (primary key) | Fast login and profile retrieval
Group search | StudyGroup.term, StudyGroup.mnemonic_num | Efficient filtering by term and course
Membership validation and lookup | Joins.computingID, Joins.groupID (composite index) | Quickly check if a user is a member and prevent duplicates
Session conflict checks | Session.date, Session.start_time, Session.end_time | Speed up room availability and time overlap detection

These indexes support the most common query patterns used by the application.

---

## Foreign Key Enforcement

Examples of foreign key relationships:

• StudyGroup.term and StudyGroup.mnemonic_num reference Course_Offerings(term, mnemonic_num)  
• Joins.computingID references User.computingID  
• Joins.groupID references StudyGroup.groupID  
• Session.groupID references StudyGroup.groupID  
• Session.building and Session.room_number reference Location(building, room_number)  
• Survey_Feedback.questionID references Survey_Questions.questionID  
• Survey_Feedback.computingID references User.computingID  
• Survey_Feedback.groupID references StudyGroup.groupID  

These relationships prevent orphaned rows and guarantee that every membership, session, and feedback entry corresponds to valid users, groups, and offerings.

---

## Trigger Enforcement

Triggers are used to enforce business rules directly in the database layer.

Typical rules:

1. Prevent overlapping sessions in the same room  

   Before inserting or updating a Session row, the trigger checks whether another session already exists in the same building and room at an overlapping time interval.

2. Validate session time ordering  

   Ensures that end_time is strictly greater than start_time for any session row.

By implementing these rules in triggers, consistency is preserved regardless of how the application code is written.

---

## API Summary

The backend exposes a set of REST endpoints under the base prefix:

/studdybuddy/api

Examples of functionality implemented:

User and authentication  
• POST /users  
  Create a new user account  
• POST /login  
  Authenticate a user and start a session  
• GET /users/:computingID  
  Fetch public profile information

Courses and offerings  
• GET /offerings  
  List course offerings with optional term filtering  
• POST /enroll  
  Enroll a user in a specific course offering

Study groups  
• POST /groups  
  Create a new study group for a given course offering  
• GET /groups  
  Search or browse groups by term and keyword  
• GET /groups/:groupID  
  Retrieve full group details including session info and member count  
• PATCH /groups/:groupID  
  Update group description (owner only)  
• DELETE /groups/:groupID  
  Delete a group (owner only)

Membership  
• POST /groups/:groupID/join  
  Join a group  
• POST /groups/:groupID/leave  
  Leave a group  
• GET /groups/:groupID/isMember  
  Check if a given user is a member  
• GET /users/:computingID/groups  
  List all groups a user has joined

Rooms and sessions  
• POST /rooms  
  Create a new room (location)  
• GET /rooms/free  
  Find available rooms for a given date and time window  
• POST /groups/:groupID/session  
  Create a session for a group  
• PATCH /groups/:groupID/session  
  Reschedule an existing session  
• GET /groups/:groupID/session  
  Fetch session details for a group

Surveys and feedback  
• GET /survey/questions  
  List active survey questions  
• POST /survey/feedback  
  Submit or update feedback for a group and question  
• GET /survey/groups/:groupID/summary  
  Aggregate response counts per question for a group



---

## Example Query Optimization

Group search  
A typical group browsing query uses:

• Filtering by term using StudyGroup.term  
• Optional keyword search on course mnemonic or description  
• Ordering by session date and time  
• LIMIT and OFFSET for pagination

The indexes on term and mnemonic_num help MySQL quickly locate relevant rows.

Room availability  
To find free rooms, the system runs a query of the form:

• Select all locations  
• Exclude any location where a Session exists in the requested time window using NOT EXISTS

Indexes on Session.date, start_time, and end_time ensure that this exclusion is efficient and does not require scanning the entire Session table.

---

## Purpose

This project demonstrates how to combine database concepts from a database systems course with a practical full stack application:

• Careful schema design  
• Appropriate use of primary keys, foreign keys, and indexes  
• Use of triggers to enforce business logic  
• Efficient and secure server side code  
• A modern frontend consuming a real API


