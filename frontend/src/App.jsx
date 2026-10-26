import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Confirm from "./pages/Confirm";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import SendMessage from "./pages/SendMessage";
import ForgotPassword from "./pages/ForgotPassword";
export default function App() {
  const { isAuth } = useAuth();
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to={isAuth ? "/inbox" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/u/:userId" element={<SendMessage />} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
