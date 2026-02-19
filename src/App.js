import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreatePlayground from "./pages/CreatePlayground";
import JoinPlayground from "./pages/JoinPlayground";
import Playground from "./pages/Playground";

function App() {
  const  themeColorMeta = document.querySelector("meta[name='theme-color']")
  themeColorMeta.setAttribute("content","#ffff")
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreatePlayground />} />
        <Route path="/join" element={<JoinPlayground />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </Router>
  );
}

export default App;