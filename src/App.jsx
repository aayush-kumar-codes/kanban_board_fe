import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from '../components/Login/Login'
import Signup from "../components/Signup/Signup"
import Home from "./Home"
import "./App.css";
import PrivateRoutes from "./PrivateRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<PrivateRoutes><Home /></PrivateRoutes>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App