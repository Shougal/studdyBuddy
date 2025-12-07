//app.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import User from "./pages/User";
import { CreateGroup } from "./pages/CreateGroup";
import FindGroups from "./pages/FindGroups";
import UserSchedule from "./pages/UserSchedule";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} user={user} />

      <div className="page-container">
        <Routes>
          {/* Landing page if logged out, Home if logged in */}
          <Route path="/" element={user ? <Home /> : <Landing />} />

          <Route path="/groups" element={<FindGroups />} />
          <Route path="/schedule" element={<UserSchedule />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/user" element={<User />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
