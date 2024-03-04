import React, { useState, useEffect, useRef } from "react";

export default function ProfilePic({ changeprofile, data }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(data.Photo);
  const [name, setName] = useState(data.name);
  const [userName, setUserName] = useState(data.userName);
  const [bio, setBio] = useState(data.bio);
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  console.log(image);
  // posting image to cloudinary
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "cantacloud2");
    fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => postPic(data.url))
      .catch((err) => console.log(err));
  };

  const postPic = (url) => {
    // saving post to mongodb
    console.log(url);
    fetch("https://socialifyfrontend.onrender.com/uploadProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setUrl(url)
      })
      .catch((err) => console.log(err));
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const editHandler = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (url && url !== data.Photo) {
      postDetails();
      user["Photo"] = url;
      localStorage.setItem("user", JSON.stringify(user));
    }
    console.log("bject");
    if (name !== data.name || bio !== data.bio) {
      await fetch("https://socialifyfrontend.onrender.com/edit-profile", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify((name !== data.name && bio !== data.bio) ? { name, bio } : name !== data.name ? { name } : { bio })
      })
      console.log("object");
      user["name"] = name;
      user["bio"] = bio;
      localStorage.setItem("user", JSON.stringify(user));

    }
    if (userName !== data.userName) {
      await fetch("https://socialifyfrontend.onrender.com/update-username", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          userName
        })
      })
      user["userName"] = userName;
      localStorage.setItem("user", JSON.stringify(user));
    }
    console.log(user);
    changeprofile();
    setTimeout(() => {
      window.location.reload();
    }, 2000)
  }
  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Edit Profile</h2>
        </div>
        <div className="profile-pic">
          <img
            src={url !== "" ? url : picLink}
            alt=""
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={handleClick}
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setUrl(URL.createObjectURL(e.target.files[0]));
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button onClick={() => { setUrl(""); setImage(""); }} className="upload-btn" style={{ color: "#ED4956" }}>
            {" "}
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={changeprofile}
          >
            cancel
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={() => editHandler()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}