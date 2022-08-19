import './App.css';
import {Routes, Route, BrowserRouter, Redirect} from 'react-router-dom';

import Home from './pages/Home/Home';
import { SignUp } from "./components/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import Messenger from "./pages/Messenger/Messenger";
import Admin from "./pages/admin/Admin";
import { AuthContext } from "./context/AuthContext";
import {useContext, useState} from "react";
import Login from "./components/Login/Login";
import {Navigate} from 'react-router-dom';
import {sendMessage} from "./services/MessageService";
import {getUserByEmail} from "./services/UserService";
import EditUser from "./pages/EditUser/EditUser";
import {getCurrentUser} from "./Utils/currentUser";
import PostItem from "./pages/PostDetails/postDetails"

function App() {
  //const userEmail = localStorage.getItem("email");
  //const password = localStorage.getItem("password");
  //console.log("email " + userEmail)
  //const [user, setUser] = useState([]);
  // if(userEmail) {
  //   const getUser = async () => {
  //     const user = await getUserByEmail(userEmail);
  //     setUser(user)
  //   }
  //   getUser();
  // }
  //console.log(password)
  const user = getCurrentUser();
  console.log("User in App.js" + user)
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home /> }>
          </Route>
          <Route path="/login" element={<Login /> }>
          </Route>
          <Route path="/register" element={user ? <Navigate to="/" /> : <SignUp />}>
          </Route>
          {/*<Route path="/logout" element={<Login />}>*/}
          {/*</Route>*/}
          <Route path="/updateUser/:userEmail" element={<EditUser/>}>
          </Route>
          <Route path="/:postID/postDetails" element={<PostItem/>}>
          </Route>
          {/*<Route exact path="/" element={<Register/>} />*/}
          {/*<Route exact path="/login" element={<Login />} />*/}
          <Route path="/profile/:userEmail" element={<Profile />} />
          {/*<Route path="/messenger" element={<Messenger/>}/>*/}
          {/*<Route path="/profile/:userEmail" element={<Profile />} />*/}
          <Route path="/messenger" element={<Messenger/>}/>
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
