import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

// Pages
import Home from "./pages/Home";
import User from "./pages/User";
import { CreateGroup } from "./pages/CreateGroup";
import FindGroups from "./pages/FindGroups";
import UserSchedule from "./pages/UserSchedule";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp.jsx";





function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    console.log("Logged in as:", userData);
    // optional: localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    console.log("User logged out");
    // optional: localStorage.removeItem("user");
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} user={user} />

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<FindGroups />} />
          <Route path="/schedule" element={<UserSchedule />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/user" element={<User />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />   {/* NEW */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
