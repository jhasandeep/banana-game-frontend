import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";

function Admin() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const socket = useMemo(() => io(`${apiUrl}`), []);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player");
  const [editingUser, setEditingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState("online");

  const token = localStorage.getItem("token");

  useEffect(() => {
    socket.on("updateOnlinePlayers", (onlineUserIds) => {
      console.log("onlineUserIds", onlineUserIds);
      setOnlineUsers(onlineUserIds);
    });
    return () => {
      socket.disconnect("updateOnlinePlayers");
    };
  }, [socket]);

  const blockUser = async (userId) => {
    try {
      await axios.patch(
        `${apiUrl}/api/admin/block/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const unblockUser = async (userId) => {
    try {
      await axios.patch(
        `${apiUrl}/api/admin/unblock/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${apiUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data.sort((a, b) => b.clickCount - a.clickCount));
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const addUser = async () => {
    const res = await axios.post(
      `${apiUrl}/api/admin/users/add`,
      { username, password, role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers([...users, res.data]);
    setUsername("");
    setPassword("");
    setRole("user");
  };

  const editUser = async (user) => {
    const res = await axios.patch(
      `${apiUrl}/api/admin/users/${user._id}`,
      { username, password, role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers(users.map((u) => (u._id === user._id ? res.data : u)));
    setEditingUser(null);
    setUsername("");
    setPassword("");
    setRole("user");
  };

  const deleteUser = async (userId) => {
    await axios.delete(`${apiUrl}/api/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter((user) => user._id !== userId));
  };

  const filteredUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) =>
      showOnlineOnly === "online" ? onlineUsers.includes(user._id) : user
    );

  return (
    <div className="min-h-screen  bg-black">
      <h2 className="text-4xl text-center pt-4 font-medium mb-2  text-yellow-500">
        Admin Dashboard
      </h2>
      <div className="flex justify-between bg-black">
        <div className="w-6/12 bg-black flex flex-col justify-center items-center  h-screen">
          <h3 className="text-3xl text-center text-white mb-2 font-medium">
            {editingUser ? "Edit User" : "Add New User"}
          </h3>
          <div className="flex flex-col justify-center items-center px-16 py-16 rounded-lg bg-white">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-64 h-12 rounded-md pl-4 placeholder:pl-2 block mt-4 border-2 border-black outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-64 h-12 rounded-md pl-4 placeholder:pl-2 block mt-4 border-4 border-black outline-none"
            />
            <select
              className="w-64 px-16 py-2 rounded-lg mt-4 border-4 border-black"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="player">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              className="px-16 py-1 mt-4 text-white bg-blue-800 text-center rounded-lg"
              onClick={editingUser ? () => editUser(editingUser) : addUser}
            >
              {editingUser ? "Update User" : "Add User"}
            </button>
          </div>
        </div>
        <div className="w-8/12 flex flex-col  items-center">
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-96 h-12 rounded-md pl-4 mt-4 placeholder:pl-2 block"
            />
            <select
              className="w-32 h-12 rounded-md mt-4 ml-4 placeholder:ml-2"
              value={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="online">Online Users</option>
            </select>
          </div>
          <ul className="bg-black shadow-md">
            {filteredUsers.length === 0 ? (
              <div className="text-center">
                <p className="text-red-600 font-medium text-2xl">
                  No User is Online
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="w-8/12 bg-white my-4 rounded-lg text-center"
                >
                  <div className="flex justify-center items-center">
                    {onlineUsers.includes(user._id) ? (
                      <div className="w-4 h-4 mt-2 bg-green-600 rounded-lg mr-2"></div>
                    ) : (
                      <div className="w-4 h-4 mt-2 bg-red-600 rounded-lg mr-2"></div>
                    )}
                    <p className="text-4xl text-blue-500 font-medium">
                      {user.username}
                    </p>
                  </div>
                  <p className="mt-2 text-2xl">
                    Score:{" "}
                    <span className="text-blue-500 font-medium">
                      {user.clickCount}
                    </span>{" "}
                    clicks
                  </p>
                  {user.isBlocked ? (
                    <button
                      className="hover:bg-green-600 px-12 py-1 mt-4 mr-2 text-white bg-blue-800 text-center rounded-lg"
                      onClick={() => unblockUser(user._id)}
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      className="hover:bg-red-600 px-12 py-1 mt-4 mr-2 text-white bg-blue-800 text-center rounded-lg"
                      onClick={() => blockUser(user._id)}
                    >
                      Block
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setUsername(user.username);
                      setPassword(user.password);
                      setRole(user.role);
                    }}
                    className="hover:bg-black px-12 py-1 mt-4 text-white bg-blue-800 text-center rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    className="hover:bg-red-600 px-16 py-1 mt-4 mb-4 text-white bg-blue-800 text-center rounded-lg"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Admin;
