// client/src/Ranking.js
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const socket = useMemo(() => {
    return io(`${apiUrl}`);
  }, []);
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/ranking`);
        setRankings(response.data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };

    fetchRankings();
  }, []);

  useEffect(() => {
    socket.on("getRanking", (data) => {
      setRankings(data.sort((a, b) => b.clickCount - a.clickCount));
    });
  }, []);

  return (
    <div className="min-h-screen text-center bg-black">
      <h2 className="text-4xl text-center pt-4  text-yellow-500 font-medium">
        {" "}
        Top 10 Ranking
      </h2>
      <div className=" w-full bg-black flex flex-col justify-center items-center mt-8 ">
        {rankings.map((user) => (
          <div
            key={user._id}
            className="min-w-72 bg-blue-600 rounded-lg mt-4 mb-4 hover:scale-105"
          >
            <p className="text-3xl text-white font-medium">{user.username}</p>
            <p className="text-2xl text-black font-medium mb-2">
              Score: <span className="text-white">{user.clickCount}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
