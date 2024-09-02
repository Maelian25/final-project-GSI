// App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"; // Check the filename and case
import Dashboard from "./Dashboard";
import Login from "./Login";
import TopMenu from "./components/TopMenuBar";
import LabNotebook from "./LabNotebook";
import Profile from "./Profile";
import Settings from "./Settings";
import Favorites from "./Favorites";
import { IUser } from "./dto/IUser";
import { config } from "./config";
import { UserService } from "./services/UserService";
import { UserContext } from "./UserContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { CircularProgress } from "@mui/material";
import TakeForm from "./components/TakeForm";

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true); // Loading state


  useEffect(() => {
    const loadUser = () => {
      const username = localStorage.getItem("username");
      if (username) {
        // Assuming UserService has a method to get a single user
        const userService = new UserService(config.API_URL);
        console.log("fetching users");
        userService.getUser(username).then((response) => {
          if (response && response.data) {
            setUser(response.data);
            console.log("user set");
            setLoading(false);
          }else {
            setUser(null);
            setLoading(false);
            console.log("user not set");
          }
        }).catch((error) => {
          console.error("API request failed", error);
          setUser(null);
          setLoading(false);
          console.log("fail");
        });
      } else {
        setUser(null);
        setLoading(false);
        console.log("user not set");
      }
    };
    loadUser();
  }, []);
  

  if (loading) {
    console.log("loading");
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
        <Route
            path="/"
            element={
              <PrivateRoute>
                <div>
                  <TopMenu />
                  <Dashboard />
                </div>
              </PrivateRoute> 
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>
                  <TopMenu />
                  <Dashboard />
                 
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/labnotebook"
            element={
              <PrivateRoute>
                <div>
                  <TopMenu />
                  <LabNotebook />
                </div>
              </PrivateRoute>
            }
          />
                    <Route
            path="/profile"
            element={
              <PrivateRoute>
                <div>
                <TopMenu />
                <Profile />
              </div>
            </PrivateRoute>
            }
          />
                    <Route
            path="/settings"
            element={
              <PrivateRoute>
                <div>
                  <TopMenu />
                  <Settings />
                </div>
            </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <div>
                  <Favorites/>
                </div>
            </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
