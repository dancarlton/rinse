import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  // TODO: Make this a slice action in userSlice.js.
  const [currentUser, setCurrentUser] = useState(null);
  const hook = async () => {
    console.log("setting Current User");
    const response = await axios.get("http://localhost:5000/api/users/current");
    console.log(response);
    setCurrentUser(response);
  };
  useEffect(() => hook, []);
  console.log(currentUser);

  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <LoginPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
