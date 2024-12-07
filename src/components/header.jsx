import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ setIsAuthenticated, user }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="bg-black flex justify-center items-center">
      <nav className="w-11/12  h-16 flex justify-between items-center">
        <Link to="/" className="text-white text-lg hover:scale-125">
          Game
        </Link>
        <Link to="/ranking" className="text-white text-lg hover:scale-125">
          Ranking
        </Link>
        {user.role === "admin" && (
          <Link className="text-white text-lg hover:scale-125" to="/admin">
            Admin
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="hover:bg-blue-600 px-16 py-2    bg-blue-500 text-white text-center rounded-lg "
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
