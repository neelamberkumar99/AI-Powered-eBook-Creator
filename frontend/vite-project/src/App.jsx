import React from "react";
import{Routes,Route} from "react-router-dom";
import LandingPages from "./pages/LandingPages";
import LoginPages from "./pages/LoginPages";
import SignupPages from "./pages/SignupPages";
import DashboardPages from "./pages/DashboardPages";
import EditBookPages from "./pages/EditBookPages";
import ViewBookPages from "./pages/ViewBookPages";
import ProfilePages from "./pages/ProfilePages";
import ProtectedRoute from "./components/auth/ProtectedRoute";
const App = () => {
  return (
    <div>
      <Routes>
        {/*public routes*/}
        <Route path="/" element={<LandingPages/>}/>
        <Route path="/login" element={<LoginPages/>}/>
        <Route path="/signup" element={<SignupPages/>}/>
        {/*protected routes*/}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute> <DashboardPages /> </ProtectedRoute>}
        />
        <Route
          path="/edit-book/:bookId"
          element={<ProtectedRoute><EditBookPages/></ProtectedRoute>}
        />
        <Route
          path="/view-book/:bookId"
          element={<ProtectedRoute><ViewBookPages/></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePages/></ProtectedRoute>}
        />

      </Routes>
    </div>
  );
};

export default App;
