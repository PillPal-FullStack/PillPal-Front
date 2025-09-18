import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Main from "../pages/Main";
import Create from "../pages/Create";
import History from "../pages/History";
import Profile from "../pages/Profile";
import Reminders from "../pages/Reminders";


const token = localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: token ? <Main /> : <Navigate to="/auth/login" />,
      },
      { path: "create", element: <Create /> },
      { path: "history", element: <History /> },
      { path: "profile", element: <Profile /> },
      { path: "reminders", element: <Reminders /> }
    ],
  },
]);

export default router;

/*
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Main from "../pages/Main";
import Create from "../pages/Create";
import History from "../pages/History";
import Profile from "../pages/Profile";
import Reminders from "../pages/Reminders";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register"

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
          <Route path="/auth/register" element={<Register />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
*/
