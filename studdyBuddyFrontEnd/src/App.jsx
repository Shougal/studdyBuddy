import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Button from "./components/buttons/Button";
import Navbar from "./components/layout/Navbar";
import StudyGroupCard from "./components/cards/studyGroupCard";
import Input from "./components/forms/Input";
import UserForm from "./components/forms/UserForm";
import { CreateGroup } from "./pages/CreateGroup";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Button
        label="Hey there"
        size="medium"
        variant="primary"
        onClick={() => console.log("clicked")}
      />
      
      <StudyGroupCard
        date="nov 6"
        mnemonic="cs3130"
        building="rice"
        start_time="9 am"
        end_time="12pm"
        capacity="2"
        members="10"
        onJoin={() => console.log("joined!")}
      />
      <div>
        <section>
          <UserForm />
        </section>
      </div>
      <div>
        <CreateGroup />

      </div>
    </>
  );
}

export default App;
