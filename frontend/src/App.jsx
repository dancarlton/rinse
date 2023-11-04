import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
