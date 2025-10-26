-- USERS
INSERT INTO User VALUES
('abc1', 'Alice Chen', 3, 'pw123'),
('xyz2', 'Shreya Patel', 2, 'pw456'),
('def3', 'Anthony Nguyen', 4, 'pw789'),
('jkl4', 'Maria Gonzalez', 1, 'pw234'),
('mno5', 'James Lee', 2, 'pw345'),
('pqr6', 'Emma Davis', 3, 'pw456'),
('stu7', 'Daniel Smith', 4, 'pw567'),
('vwx8', 'Sophia Nguyen', 3, 'pw678'),
('yza9', 'Liam Patel', 1, 'pw789'),
('bcd0', 'Olivia Chen', 2, 'pw890'),
('efg1', 'Ethan Kim', 4, 'pw901'),
('hij2', 'Ava Johnson', 3, 'pw012'),
('klm3', 'Noah Brown', 4, 'pw134'),
('nop4', 'Isabella Wilson', 1, 'pw245'),
('qrs5', 'Mason Clark', 2, 'pw356'),
('tuv6', 'Mia Walker', 3, 'pw467'),
('wxy7', 'Lucas Hall', 4, 'pw578'),
('zab8', 'Ella Allen', 2, 'pw689'),
('cde9', 'Henry Young', 3, 'pw790'),
('fgh0', 'Grace Scott', 4, 'pw801');

-- COURSES
INSERT INTO Course VALUES
('CS3240', 'Software Engineering'),
('CS4750', 'Database Systems'),
('CS3710', 'Introduction to Cybersecurity'),
('CS4414', 'Operating Systems'),
('CS4610', 'Programming Languages'),
('CS1010', 'Introduction to Information Technology'),
('CS1110', 'Introduction to Programming'),
('CS1111', 'Introduction to Programming'),
('CS1112', 'Introduction to Programming'),
('CS1113', 'Introduction to Programming'),
('CS1120', 'Introduction to Computing: Explorations in Language, Logic, and Machines'),
('CS1501', 'Special Topics in Computer Science'),
('CS1511', 'Special Topics in Computer Science'),
('CS2100', 'Data Structures and Algorithms 1'),
('CS2120', 'Discrete Mathematics and Theory 1'),
('CS2130', 'Computer Systems and Organization 1'),
('CS3100', 'Data Structures and Algorithms 2'),
('CS3120', 'Discrete Mathematics and Theory 2'),
('CS3130', 'Computer Systems and Organization 2'),
('CS3140', 'Software Development Essentials');


-- COURSE OFFERINGS
INSERT INTO Course_Offerings VALUES
('Fall2025', 'CS1010'),
('Fall2025', 'CS1110'),
('Fall2025', 'CS1111'),
('Fall2025', 'CS1112'),
('Fall2025', 'CS1113'),
('Fall2025', 'CS1120'),
('Spring2025', 'CS1501'),
('Spring2025', 'CS1511'),
('Fall2025', 'CS2100'),
('Fall2025', 'CS2120'),
('Spring2025', 'CS2120'),
('Spring2025', 'CS2130'),
('Spring2025', 'CS3100'),
('Fall2025', 'CS3120'),
('Fall2025', 'CS3130'),
('Spring2025', 'CS3140'),
('Spring2025', 'CS3240'),
('Fall2025', 'CS3710'),
('Fall2025', 'CS4414'),
('Spring2025', 'CS4610'),
('Spring2025', 'CS4750');


-- ENROLLMENT
INSERT INTO Enrollment VALUES
('abc1','CS4750','Spring2025'),
('xyz2','CS3240','Spring2025'),
('def3','CS3710','Fall2025'),
('jkl4','CS2100','Fall2025'),
('mno5','CS2120','Fall2025'),
('pqr6','CS3130','Fall2025'),
('stu7','CS3140','Spring2025'),
('vwx8','CS3120','Fall2025'),
('yza9','CS4414','Fall2025'),
('bcd0','CS1110','Fall2025'),
('efg1','CS1111','Fall2025'),
('hij2','CS1112','Fall2025'),
('klm3','CS1113','Fall2025'),
('nop4','CS1120','Fall2025'),
('qrs5','CS1501','Spring2025'),
('tuv6','CS1511','Spring2025'),
('wxy7','CS3100','Spring2025'),
('zab8','CS4610','Spring2025'),
('cde9','CS1010','Fall2025'),
('fgh0','CS2130','Spring2025');

-- STUDY GROUPS
INSERT INTO StudyGroup (owner_computingID, term, mnemonic_num, description) VALUES
('abc1','Spring2025','CS4750','Database design collaboration'),
('xyz2','Spring2025','CS3240','Software project planning'),
('def3','Fall2025','CS3710','Cybersecurity case study'),
('jkl4','Fall2025','CS2100','Data structures review'),
('mno5','Fall2025','CS2120','Proof practice group'),
('pqr6','Fall2025','CS3130','Systems midterm prep'),
('stu7','Spring2025','CS3140','Testing workshop'),
('vwx8','Fall2025','CS3120','Theory deep dive'),
('yza9','Fall2025','CS4414','OS kernel concepts'),
('bcd0','Fall2025','CS1110','Intro to loops practice'),
('efg1','Fall2025','CS1111','Python labs review'),
('hij2','Fall2025','CS1112','Intro assignments help'),
('klm3','Fall2025','CS1113','Domain project discussion'),
('nop4','Fall2025','CS1120','Scheme problem-solving'),
('qrs5','Spring2025','CS1501','Special topic: AI in art'),
('tuv6','Spring2025','CS1511','Special topic: ethics in tech'),
('wxy7','Spring2025','CS3100','Algorithm analysis workshop'),
('zab8','Spring2025','CS4610','OCaml syntax help'),
('cde9','Fall2025','CS1010','Spreadsheet project tips'),
('fgh0','Spring2025','CS2130','C programming support');

-- JOINS
INSERT INTO Joins VALUES
('abc1',1),
('xyz2',1),
('def3',1),
('jkl4',2),
('mno5',3),
('pqr6',3),
('stu7',4),
('vwx8',4),
('yza9',5),
('bcd0',5),
('efg1',6),
('hij2',6),
('klm3',7),
('nop4',8),
('qrs5',9),
('tuv6',10),
('wxy7',11),
('zab8',12),
('cde9',13),
('fgh0',14);


-- LOCATIONS
INSERT INTO Location (building, room_number, capacity) VALUES
('Rice Hall', '011', 24),
('Rice Hall', '032', 35),
('Rice Hall', '130', 168),
('Rice Hall', '340', 38),
('Olsson', '001', 48),
('Olsson', '005', 80),
('Olsson', '009', 82),
('Olsson', '018', 90),
('Thornton', 'A120', 93),
('Thornton', 'A207', 48),
('Thornton', 'D115', 35),
('Thornton', 'D223', 48),
('Thornton', 'E303', 100),
('Thornton', 'E316', 94),
('Mechanical Engineering', '205', 150),
('Mechanical Engineering', '213', 48),
('Mechanical Engineering', '214', 30),
('Mechanical Engineering', '215', 32),
('Mechanical Engineering', '339', 72),
('Mechanical Engineering', '341', 84);



-- SESSIONS
INSERT INTO Session VALUES
('2025-11-01', '17:00', '18:30', 'Rice Hall', '011', 1),
('2025-11-02', '16:00', '17:30', 'Rice Hall', '032', 2),
('2025-11-03', '18:00', '19:00', 'Rice Hall', '130', 3),
('2025-11-04', '15:00', '16:30', 'Rice Hall', '340', 4),
('2025-11-05', '14:00', '15:30', 'Olsson', '001', 5),
('2025-11-06', '13:30', '15:00', 'Olsson', '005', 6),
('2025-11-07', '17:00', '18:30', 'Olsson', '009', 7),
('2025-11-08', '12:00', '13:30', 'Olsson', '018', 8),
('2025-11-09', '16:00', '17:30', 'Thornton', 'A120', 9),
('2025-11-10', '18:30', '20:00', 'Thornton', 'A207', 10),
('2025-11-11', '17:00', '18:30', 'Thornton', 'D115', 11),
('2025-11-12', '15:00', '16:30', 'Thornton', 'D223', 12),
('2025-11-13', '14:00', '15:30', 'Thornton', 'E303', 13),
('2025-11-14', '19:00', '20:30', 'Thornton', 'E316', 14),
('2025-11-15', '13:00', '14:30', 'Mechanical Engineering', '205', 15),
('2025-11-16', '15:30', '17:00', 'Mechanical Engineering', '213', 16),
('2025-11-17', '12:00', '13:30', 'Mechanical Engineering', '214', 17),
('2025-11-18', '10:00', '11:30', 'Mechanical Engineering', '215', 18),
('2025-11-19', '17:00', '18:30', 'Mechanical Engineering', '339', 19),
('2025-11-20', '18:00', '19:30', 'Mechanical Engineering', '341', 20);


-- SURVEY QUESTIONS
INSERT INTO Survey_Questions (question, type_is, is_active) VALUES
('How effective was the study session?','rating',TRUE),
('Would you join again?','yes/no',TRUE),
('Was the time convenient for you?','yes/no',TRUE);

-- SURVEY FEEDBACK
INSERT INTO Survey_Feedback (questionID, computingID, groupID, response) VALUES
(1,'abc1',1,'5/5 - super productive'),
(2,'xyz2',1,'yes'),
(3,'xyz2',2,'no - too late in the day'),
(1,'def3',3,'4/5 - helpful but long');