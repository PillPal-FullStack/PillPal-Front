import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Main from "../pages/Main";
import Create from "../pages/Create";
import History from "../pages/History";
import Profile from "../pages/Profile";
import Reminders from "../pages/Reminders";
import Login from "../pages/auth/Login";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/create" element={<Create />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/auth/login" element={<Login />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
