import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import SearchIcon from "@mui/icons-material/Search";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// import ImageIcon from "@mui/icons-material/Image";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FaceIcon from "@mui/icons-material/Face";
export default function Navbar({ login }) {
  let userData = [];
  const { setModalOpen } = useContext(LoginContext);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [userdataname, setNamedata] = useState();
  useEffect(() => { });
  const searchApi = async (search) => {
    try {
      const response = await fetch("https://socialifyfrontend.onrender.com/searchUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: search }),
      });
      const data = await response.json();
      console.log(data);
      setSearchData(data);
    } catch (error) {
      console.log("error when you search data", error);
    }
  };
  if (searchData.userNameSearch) {
    const data = searchData.userNameSearch.map(
      (item) => item.name + item.userName
    );
    console.log(data);
  }
  console.log(userdataname);
  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    const handleClose = () => {
      setSearch("");
      setSearchData([]);
    };
    if (login || token) {
      return [
        <>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link to="/createPost">Create Post</Link>
          <Link style={{ marginLeft: "20px" }} to="/followingpost">
            My Following
          </Link>
          {/* searchbar user*/}
          <div className="search_form">
            <input
              type="text"
              name="search"
              value={search}
              id="search"
              title="Enter to Search"
              onChange={(e) => {
                e.preventDefault();
                setSearch(e.target.value.toLowerCase().replace(/ /g, ""));
                searchApi(search);
              }}
            />

            <div className="search_icon" style={{ opacity: search ? 0 : 0.3 }}>
              <SearchIcon />
              <span className="material-icons">search user</span>
              {/* <span>Enter to Search</span> */}
            </div>

            <div
              className="close_search"
              onClick={handleClose}
              style={{ opacity: search ? 1 : 0 }}
            >
              &times;
            </div>

            <button type="submit" style={{ display: "none" }}>
              Search
            </button>

            <div className="users">
              {searchData.userNameSearch &&
                searchData.userNameSearch.map((item) => (
                  <List
                    key={item._id}
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                    }}
                  >
                    <Link to={`/profile/${item._id}`}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <FaceIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={item.userName}
                        />
                      </ListItem>
                    </Link>
                  </List>
                ))}
            </div>
          </div>
          <Link to={""}>
            <button className="primaryBtn" onClick={() => setModalOpen(true)}>
              Log Out
            </button>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="/signup">
            <li>SignUp</li>
          </Link>
          <Link to="/signin">
            <li>SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  return (
    <div className="navbar">
      <h1 >Socialify</h1>
      <ul className="nav-menu">{loginStatus()}</ul>
    </div>
  );
}