import { Route, Routes } from "react-router-dom";
import Profile from "./screens/profile/Profile.jsx";
import Register from "./screens/register/Register.jsx";
import Games from "./screens/games/Games.jsx";
import Ladder from "./screens/ladder/Ladder.jsx";
import Home from "./screens/home/Home.jsx";
import Login from "./screens/logIn/LogIn.jsx";
import { UserProvider } from "./contexts/userContexts.jsx";
import 'boxicons/css/boxicons.min.css';
import "./assets/resetCss/reset.css";

const App = () => {
  return (
    <div className="App">
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/games" element={<Games />} />
          <Route path="/ladder" element={<Ladder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </UserProvider>
    </div>
  );
};

export default App;
