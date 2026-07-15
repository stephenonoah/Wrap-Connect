import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Apply from "./pages/Apply";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
      </Routes>
    </BrowserRouter>
  );
}