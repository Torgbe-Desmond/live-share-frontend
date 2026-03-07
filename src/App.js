import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreatePlayground from "./pages/CreatePlayground";
import JoinPlayground from "./pages/JoinPlayground";
import Playground from "./pages/Playground";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import ChatRoom from "./pages/ChatRoom";

function App() {
  const theme = useTheme();
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const meta = document.querySelector("meta[name='theme-color']");
    if (meta) {
      meta.setAttribute(
        "content",
        isDark ? "#202327" : "#f0f2f5",
      );
    }
  }, [prefersDark, theme,isDark]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreatePlayground />} />
        <Route path="/join" element={<JoinPlayground />} />
        <Route path="/playground" element={<Playground />}>
          <Route index element={<ChatRoom />} />
          {/* You can later add /playground/settings, /playground/files etc */}
        </Route>{" "}
      </Routes>
    </Router>
  );
}

export default App;
