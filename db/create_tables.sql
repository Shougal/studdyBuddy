-- 1. User table
CREATE TABLE User (
    computingID VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INT,
    password_hash VARCHAR(255) NOT NULL
);

-- 2. Course table
CREATE TABLE Course (
    mnemonic_num VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 3. Course_Offerings table
CREATE TABLE Course_Offerings (
    term VARCHAR(10),
    mnemonic_num VARCHAR(10),
    PRIMARY KEY (term, mnemonic_num),
    FOREIGN KEY (mnemonic_num) REFERENCES Course(mnemonic_num)
);

-- 4. Enrollment table
CREATE TABLE Enrollment (
    computingID VARCHAR(10),
    term VARCHAR(10),
    mnemonic_num VARCHAR(10),
    PRIMARY KEY (computingID, mnemonic_num, term),
    FOREIGN KEY (computingID) REFERENCES User(computingID),
    FOREIGN KEY (term, mnemonic_num) REFERENCES Course_Offerings(term, mnemonic_num)
);

-- 5. StudyGroup table
CREATE TABLE StudyGroup (
    groupID INT PRIMARY KEY AUTO_INCREMENT,
    owner_computingID VARCHAR(10) NOT NULL,
    term VARCHAR(10) NOT NULL,
    mnemonic_num VARCHAR(10) NOT NULL,
    description TEXT,
    FOREIGN KEY (owner_computingID) REFERENCES User(computingID),
    FOREIGN KEY (term, mnemonic_num) REFERENCES Course_Offerings(term, mnemonic_num)
);

-- 6. Joins table
CREATE TABLE Joins (
    computingID VARCHAR(10),
    groupID INT,
    PRIMARY KEY (computingID, groupID),
    FOREIGN KEY (computingID) REFERENCES User(computingID),
    FOREIGN KEY (groupID) REFERENCES StudyGroup(groupID)
);

-- 7. Location table
CREATE TABLE Location (
    building VARCHAR(50),
    room_number VARCHAR(10),
    capacity INT NOT NULL, 
    PRIMARY KEY (building, room_number)
);

-- 8. Session table
CREATE TABLE Session (
    date DATE,
    start_time TIME,
    end_time TIME,
    building VARCHAR(50),
    room_number VARCHAR(10),
    groupID INT NOT NULL UNIQUE,
    -- advanced sql constraint
	CONSTRAINT chk_end_after_start
    CHECK (end_time > start_time),
    PRIMARY KEY (date, start_time, end_time, building, room_number),
    FOREIGN KEY (building, room_number) REFERENCES Location(building, room_number),
    FOREIGN KEY (groupID) REFERENCES StudyGroup(groupID)
);

-- 9. Survey_Questions table
CREATE TABLE Survey_Questions (
    questionID INT PRIMARY KEY AUTO_INCREMENT, 
    question TEXT NOT NULL,
    type_is VARCHAR(100),
    is_active BOOLEAN
);

-- 10. Survey_Feedback table
CREATE TABLE Survey_Feedback (
    questionID INT,
    computingID VARCHAR(10),
    groupID INT,
    response TEXT NOT NULL, 
    PRIMARY KEY (questionID, computingID, groupID),
    FOREIGN KEY (questionID) REFERENCES Survey_Questions(questionID),
    FOREIGN KEY (computingID) REFERENCES User(computingID),
    FOREIGN KEY (groupID) REFERENCES StudyGroup(groupID)
);
-- advanced SQL technique
CREATE TRIGGER capacity_check
BEFORE INSERT ON Joins
FOR EACH ROW 
BEGIN 
-- condition
	DECLARE max_capacity INT; 
	DECLARE current_members INT; 
	
	-- find max capacity for location used by new_group 
	SELECT l.capacity INTO max_capacity
	FROM Location l 
	INNER JOIN Session s ON l.building = s.building AND l.room_number = s.room_number
	WHERE s.groupID = NEW.groupID;

    -- count number of members present in the JOINS table—-
	SELECT  COUNT(*) INTO current_members
	FROM JOINS
	WHERE groupID = NEW.groupID; 
	
	-- raise error if capacity has been exceeded—-
	IF current_members >= max_capacity THEN 
	SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Error: Location capacity has been exceeded. Cannot join study group';
    END IF; 

END;

-- advanced trigger
CREATE TRIGGER prevent_overlap
BEFORE INSERT ON Session
FOR EACH ROW 
BEGIN
    -- check for conflicts in the same room on the same date 
    IF EXISTS (
        SELECT 1 
        FROM SESSION 
        WHERE building = NEW.building 
        AND room_number = NEW.room_number 
        AND date = NEW.date 
    -- overlap occurs if the new session starts before the existing one ends,
    -- AND the new session ends before the existing one starts.
        AND(NEW.start_time < end_time AND NEW.end_time > start_time)
    )
    THEN 
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Room already booked during that time'; 
    END IF; 
END;


