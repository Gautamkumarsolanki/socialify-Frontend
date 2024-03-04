import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import "./Createpost.css";
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";
import Slider from "react-slick";

export function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: props.len > 1 ? "block" : "none", background: "red" }}
      onClick={onClick}
    />
  );
}

export function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: props.len > 1 ? "block" : "none", background: "green" }}
      onClick={onClick}
    />
  );
}

export default function Createpost() {

  const { state } = useLocation();
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null)
  const [url, setUrl] = useState("")
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Toast functions
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  useEffect(() => {
    if (state && state.postData !== null) {
      setImage(state.postData.photo);
      setBody(state.postData.body);
    }
  }, [])

  useEffect(() => {
    console.log(state.postData);
    // saving post to mongodb
    if (image && url.length === image.length) {
      let newData = {};
      if (state.postData === null) {
        newData = {
          body,
          pic: url
        };
      } else {
        if (url[0] !== state.postData.photo[0]) {
          newData["pic"] = url;
        } if (body !== state.postData.body) {
          newData["body"] = body;
        }
        newData["id"]=state.postData._id
      }
      if (Object.keys(newData).length > 0) {
        const url = state.postData === null ? "https://socialifyfrontend.onrender.com/createPost" : `https://socialifyfrontend.onrender.com/edit-post/${state.postData._id}`;
        const method = state.postData === null ? "post" : "put";
        console.log(url, method);
        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          },
          body: JSON.stringify(newData)
        }).then(data => {
          if (data.error) {
            notifyA(data.error)
          } else {
            setLoading(false);
            if (state.postData === null) {
              notifyB("Successfully Posted")
              navigate("/")
            } else {
              notifyB("Successfully Updated")
              navigate("/profile")
            }
          }
        })
          .catch(err => console.log(err))
      }
    }
  }, [url])

  image && console.log(typeof image[0]);
  // posting image to cloudinary
  const postDetails = async () => {
    if (image === null) {
      notifyA("Please select image");
      return
    }
    if (typeof image[0] === "string") {
      setUrl(image);
      return
    }
    Object.keys(image).forEach(async (index) => {
      setLoading(true);
      const data = new FormData()
      data.append("file", image[index])
      data.append("upload_preset", "insta-clone")
      data.append("cloud_name", "cantacloud2")
      const res = await fetch("https://api.cloudinary.com/v1_1/cantacloud2/image/upload", {
        method: "post",
        body: data
      })
      const imageData = await res.json();
      setUrl((prev) => [...prev, imageData.url]);
      console.log(imageData);
    })
  }
  const settings = {
    dots: true,
    infinite: image && image.length >= 2,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow len={image && image.length} />,
    prevArrow: <SamplePrevArrow len={image && image.length} />
  };

  useEffect(() => {
    if (image && image.length === 0) {
      setImage(null);
    }
  }, [image])
  return (
    <div className="createPost">
      {/* //header */}
      <div className="post-header">
        <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
        <button id="post-btn" onClick={() => { postDetails() }}>{state.postData === null ? loading ? "Creating" : "Create" : loading ? "Updating" : "Update"}</button>
      </div>
      {/* image preview */}
      <div className="main-div" style={{ height: "30rem", width: "30rem" }}>
        <input
          style={{ cursor: "pointer", marginTop: "10px", marginBottom: "4rem" }}
          type="file"
          accept="image/*"
          onChange={(event) => {
            // loadfile(event);
            setImage(event.target.files)
          }}
          multiple
        />
        {
          image === null ? (
            <img
              alt=""
              id="output"
              src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
            />
          ) : (
            <Slider {...settings}>
              {
                Object.keys(image).map((index) => (
                  <div key={index}>
                    <img
                      style={{ marginLeft: "80px", marginTop: '20px' }}
                      alt=""
                      id="output"
                      src={typeof image[index] === "object" ? URL.createObjectURL(image[index]) : image[index]}
                    />
                  </div>
                ))
              }
            </Slider>
          )
        }


      </div>
      {/* details */}
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
            <img
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
              alt=""
            />
          </div>
          <h5>Ramesh</h5>
        </div>
        <textarea value={body} onChange={(e) => {
          setBody(e.target.value)
        }} type="text" placeholder="Write a caption...."></textarea>
      </div>
    </div>
  );
}
