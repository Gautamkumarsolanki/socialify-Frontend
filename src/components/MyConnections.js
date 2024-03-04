import React, { useEffect, useState } from 'react';
import ConnectionTab from './ConnectionTab';
import { useParams } from "react-router-dom";



const MyConnections = () => {
  // Assuming followers and following are arrays of objects containing user information
  const [followData, setFollowData] = useState(null);
  const { id } = useParams();

  const getFollowData = async () => {
    const res = await fetch(`https://socialifyfrontend.onrender.com/getFollowData/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      }
    });
    const followData = await res.json();
    setFollowData(followData.data)
  }
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))["_id"] === id) {
      setFollowData({ followers: JSON.parse(localStorage.getItem("user"))["followers"], following: JSON.parse(localStorage.getItem("user"))["following"] })
    } else {
      getFollowData();
    }
  }, [])
  return (
    <>

      {
        followData === null ? (
          <h1> Loading</h1 >
        ) : (
          <div>
            <h1>User Profile</h1>
            <ConnectionTab followers={followData.followers} following={followData.following} />
          </div>)
      }
    </>

  );
};

export default MyConnections;
