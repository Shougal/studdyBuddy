import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

// Pages
import Home from "./pages/Home";
import User from "./pages/User";
import { CreateGroup } from "./pages/CreateGroup";
import FindGroups from "./pages/FindGroups";
import UserSchedule from "./pages/UserSchedule";

function App() {
  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <Router>
      <Navbar onLogout={handleLogout} />

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/groups" element={<FindGroups />} />
          <Route path="/schedule" element={<UserSchedule />} />
          <Route path="/create-group" element={<CreateGroup />} />  {/* <-- FIX */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
