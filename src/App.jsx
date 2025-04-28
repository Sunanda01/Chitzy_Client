import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import ErrorPage from "./pages/ErrorPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { setupInterceptors } from "./services/axiosInstance";

function App() {
  const { authUser } = useAuthStore();
  console.log('authUser',authUser);
  useEffect(() => {
    setupInterceptors();
    // checkAuth();
  }, []);
  // if (isCheckingAuth)
  //   return (
  //     <div className="flex justify-center ">
  //       <span className="loading loading-ring loading-3xl"></span>
  //       <span>LOADING........................</span>
  //     </div>
  //   );
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
