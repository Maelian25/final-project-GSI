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
import { IUser } from "./dto/IUser";
import { config } from "./config";
import { UserService } from "./services/UserService";
import { UserContext } from "./UserContext";
import { PrivateRoute } from "./components/PrivateRoute";


function App() {
  const [authResult, setAuthResult] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  // useEffect(() => {
  //   const username = localStorage.getItem("username");
  //   if (username) {
  //     const userService = new UserService(config.API_URL);
  //     const response = userService.getUsers();
  //     response.then((users) => {
  //       if (users) {
  //         const user = users.data.find(
  //           (user: any) => user.username === username
  //         );
  //         if (user) {
  //           setUser(user);
  //         }
  //       }
  //     });
  //   }
  // }, []);


  const handleLogin = async (
    email: string,
    password: string
  ): Promise<string> => {
    try {
      //const response = await fetch("https://tt-api.azurewebsites.net/users/");
      const userService = new UserService(config.API_URL);
      const response = await userService.getUsers();
      if (response) {
        //const userData = await response.json();
        //const user = userData.find((user: any) => user.mail === email);
        const user = response.data.find((user: any) => user.mail === email);
        
        if (user && user.hashed_password === password) {
          setAuthResult("success");
          setUser(user);
          localStorage.setItem("username", user.username);
          return "success";
        } else {
          setAuthResult("failure");
          return "failure";
        }
      } else {
        setAuthResult("error");
        return "error";
      }
    } catch (error) {
      console.error("API request failed", error);
      setAuthResult("error");
      return "error";
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
        <Route
            path="/"
            element={
              <PrivateRoute handleLogin={handleLogin}>
                <div>
                  <TopMenu />
                  <Dashboard />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute handleLogin={handleLogin}>
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
              <div>
              <TopMenu />
              <LabNotebook />
            </div>
            }
          />
                    <Route
            path="/profile"
            element={
              <div>
              <TopMenu />
              <Profile />
            </div>
            }
          />
                    <Route
            path="/settings"
            element={
              <div>
              <TopMenu />
              <Settings />
            </div>
            }
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
