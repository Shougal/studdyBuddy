-- USERS
INSERT INTO User VALUES
('abc1', 'Alice Chen', 3, 'pw123'),
('xyz2', 'Shreya Patel', 2, 'pw456'),
('def3', 'Anthony Nguyen', 4, 'pw789');

-- COURSES
INSERT INTO Course VALUES
('CS3240', 'Software Engineering'),
('CS4750', 'Database Systems'),
('CS3710', 'Introduction to Cybersecurity');

-- COURSE OFFERINGS
INSERT INTO Course_Offerings VALUES
('Fall2025', 'CS3240'),
('Fall2025', 'CS4750'),
('Spring2025', 'CS3710');

-- ENROLLMENT
INSERT INTO Enrollment VALUES
('abc1','CS4750','Fall2025'),
('xyz2','CS4750','Fall2025'),
('def3','CS3240','Fall2025');

-- STUDY GROUPS
INSERT INTO StudyGroup VALUES
(1,'abc1','Fall2025','CS4750','Group for project collaboration'),
(2,'xyz2','Fall2025','CS4750','Midterm review group'),
(3,'def3','Fall2025','CS3240','Design sprint and sprint planning');

-- JOINS
INSERT INTO Joins VALUES
('abc1',1),
('xyz2',1),
('xyz2',2),
('def3',3);

-- LOCATIONS
INSERT INTO Location VALUES
('Rice Hall','340',30),
('Thornton','C211',25),
('Olsson','120',40);

-- SESSIONS
INSERT INTO Session VALUES
('2025-11-10','17:00','19:00','Rice Hall','340',1),
('2025-11-12','16:00','18:00','Thornton','C211',2),
('2025-11-15','14:00','16:00','Olsson','120',3);

-- SURVEY QUESTIONS
INSERT INTO Survey_Questions VALUES
(1,'How effective was the study session?','rating',TRUE),
(2,'Would you join again?','yes/no',TRUE),
(3,'Was the time convenient for you?','yes/no',TRUE);

-- SURVEY FEEDBACK
INSERT INTO Survey_Feedback VALUES
(1,'abc1',1,'5/5 - super productive'),
(2,'xyz2',1,'yes'),
(3,'xyz2',2,'no - too late in the day'),
(1,'def3',3,'4/5 - helpful but long');




