import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import { SignUp } from "./components/SignUp/SignUp";
import Admin from "./pages/admin/Admin";
import EditUser from "./pages/EditUser/EditUser";
import Home from "./pages/Home/Home";

import PostItem from "./pages/PostDetails/postDetails";
import Profile from "./pages/Profile/Profile";
import { getCurrentUser } from "./Utils/currentUser";

function App() {
  const user = getCurrentUser();

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <SignUp />}
          ></Route>

          <Route path="/updateUser/:userEmail" element={<EditUser />}></Route>
          <Route path="/:postID/postDetails" element={<PostItem />}></Route>
          <Route path="/profile/:userEmail" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
