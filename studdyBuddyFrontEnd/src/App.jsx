//app.jsx
import React, { useState } from "react"; //stores logged in user
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  //import routing tools from react-router-dom to define different URLS for diff pages
import Navbar from "./components/layout/Navbar"; //import navbar and all components that represent each screen in the app

// Pages -import all pages into app
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { CreateGroup } from "./pages/CreateGroup";
import FindGroups from "./pages/FindGroups";
import UserSchedule from "./pages/UserSchedule";
import User from "./pages/User";

function App() { //defines main app component
  const [user, setUser] = useState(null); //creates state(user) that is null to begin with meaning no user;tracks who is logged in 

  const handleLogin = (userData) => {  //called when login succeeds
    setUser(userData); 
  };

  const handleLogout = () => { //clears user by setting user back to null
    setUser(null);
  };

  return (
    <Router> //wraps entire app in BrowserRouter, enabling URL based navigation
      <Navbar onLogout={handleLogout} user={user} /> //nav bar is rendered on easch page

      <div className="page-container">
        <Routes>
          {/* Landing page if logged out, Home if logged in */}
          <Route path="/" element={user ? <Home /> : <Landing />} /> //if user exists go to home if not landing
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
