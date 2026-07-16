import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// IMPORT YOUR PAGES HERE (Adjust the paths if your folders are different)
import Home from "./pages/Home"; 
import Apply from "./pages/Apply"; 

// 1. ScrollToTop Helper Component
// This listens to the URL and forces the browser to the top on every page change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 2. Main App Component
export default function App() {
  return (
    <Router>
      {/* ScrollToTop MUST be inside the Router, but outside the Routes */}
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        
        {/* If you have a 404 Not Found page, you can add it like this: */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}