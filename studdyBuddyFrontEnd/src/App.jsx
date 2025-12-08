import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import Navbar from "./components/layout/Navbar";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import CreateGroup from "./pages/CreateGroup";
import FindGroups from "./pages/FindGroups";
import UserSchedule from "./pages/UserSchedule";
import GroupDetails from "./pages/Groupdetails";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Restore login on refresh
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // ✅ Login handler
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <ToastProvider>
      <Router>
        <Navbar onLogout={handleLogout} user={user} />
        <div style={{ padding: "24px 32px", background: "#f8f9fa", minHeight: "calc(100vh - 64px)" }}>
          <Routes>
            <Route path="/" element={user ? <Home user={user} /> : <Landing />} />
            <Route path="/groups" element={<FindGroups user={user} />} />
            <Route path="/groups/:groupID" element={<GroupDetails user={user} />} />
            <Route path="/create-group" element={<CreateGroup user={user} />} />
            <Route path="/schedule" element={<UserSchedule user={user} />} />
            <Route path="/feedback/:groupID" element={<Feedback user={user} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
