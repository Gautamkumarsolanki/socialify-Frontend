import React, { useEffect, useState } from "react";
import PostDetail from "./PostDetail";
import "./Profile.css";
import ProfilePic from "./ProfilePic";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Button from "@mui/material/Button";
//import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { Link } from "react-router-dom";

export default function Profie() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false)
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("")
  const [changePic, setChangePic] = useState(false)


  const toggleDetails = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  const editProfile = () => {
    if (changePic) {
      setChangePic(false)
    } else {
      setChangePic(true)
    }
  }


  useEffect(() => {
    fetch(`https://socialifyfrontend.onrender.com/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPic(result.post);
        setUser(result.user)
        console.log(pic);
        console.log(user);
      });
  }, []);

  console.log(pic);
  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img
            src={user.Photo ? user.Photo : picLink}
            alt=""
          />
          <h1 className="bio">
            {" "}
            {JSON.parse(localStorage.getItem("user")).name}
          </h1>
          <h1 className="bio">NIT KURUKSHETRA</h1>
        </div>
        {/* profile-data */}
        <div className="pofile-data">
          <div className="upsidealign">
            <h1 className="name">
              {JSON.parse(localStorage.getItem("user")).name}
            </h1>
            <Button variant="contained" className="followbutton">
              FOLLOW
            </Button>
          </div>
          <div className="profile-info" style={{ display: "flex" }}>
            <div className="setNumbers">
              <p className="paragraphdata">posts</p>
              <span>{pic ? pic.length : "0"}</span>
            </div>
            <Link to={`/connections/${user._id}`} className="setNumbers">
              <p className="paragraphdata">following</p>
              <span>{user.following ? user.following.length : "0"} </span>
            </Link>
            <Link to={`/connections/${user._id}`} className="setNumbers">
              <p className="paragraphdata">followers</p>
              <span>{user.followers ? user.followers.length : "0"}</span>
            </Link>
          </div>

          <div className="bottomheading">
            <Button variant="outlined" color="error" className="deletebutton">
              Unfollow
            </Button>
            <Button
              variant="outlined"
              endIcon={<SendIcon />}
              className="sendbuttons"
            >
              message
            </Button>
          </div>
        </div>
      </div>
      <button style={{ backgroundColor: "black", color: "white" }} onClick={editProfile}>
        Edit Profile
      </button>
      <hr
        style={{
          width: "40rem",
          opacity: "0.8",
          margin: "17px auto",
          position: "relative",
          right: "3rem",
          top: "1.2rem",
        }}
      />
      {/* Gallery */}
      <div className="gallery">
        <div className="hrbottom">
          <AddToPhotosIcon />
          <p>POSTS</p>
        </div>{" "}
        <ImageList cols={3} rowHeight={164}>
          {pic.map((pics) => (
            <ImageListItem key={pics._id}>
              <img
                srcSet={`${pics.photo[0]}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${pics.photo[0]}?w=164&h=164&fit=crop&auto=format`}
                className="imageset"
                alt={pics.title}
                loading="lazy"
                onClick={() => {
                  toggleDetails(pics);
                }}
                style={{ width: "10rem", height: "16rem" }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
      {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}
      {changePic && <ProfilePic changeprofile={editProfile} data={user}/>}
    </div>
  );
}

