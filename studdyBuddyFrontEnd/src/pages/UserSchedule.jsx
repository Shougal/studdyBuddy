import React, { useState } from "react";
import Button from "../components/buttons/Button";
import Input from "../components/forms/Input";

export default function UserSchedule() {
  const [course, setCourse] = useState("");
  const [myCourses, setMyCourses] = useState([]);

  const addCourse = () => {
    if (!course.trim()) return;
    setMyCourses([...myCourses, course]);
    setCourse("");
  };

  return (
    <div>
      <h2>My Courses</h2>

      <Input 
        label="Add a Course (e.g., CS3130)"
        name="course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />

      <Button label="Add Course" onClick={addCourse} />

      <h3>Courses Added:</h3>
      <ul>
        {myCourses.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
