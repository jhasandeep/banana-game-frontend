import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./components/register";
import Login from "./components/login";
import Player from "./components/player";
import Admin from "./components/admin";
import Ranking from "./components/ranking";
import Header from "./components/header";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function App() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState({});
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded = jwtDecode(token);

        const userId = decoded._id;

        try {
          const response = await axios.post(
            `${apiUrl}/api/ranking/user`,
            { playerId: userId },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log(response.data, "user");
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching User", error);
        }
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  console.log(user, "user");
  return (
    <Router>
      {isAuthenticated && (
        <Header setIsAuthenticated={setIsAuthenticated} user={user} />
      )}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login setIsAuthenticated={setIsAuthenticated} user={user} />
          }
        />
        <Route
          exact
          path="/"
          element={
            isAuthenticated ? <Player user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/ranking"
          element={isAuthenticated ? <Ranking /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <Admin /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
