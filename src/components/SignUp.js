import React, { useContext, useState } from "react";
import logo from "../img/navbarlogo.png";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { LoginContext } from "../context/LoginContext";

export default function SignUp() {
	const { setUserLogin } = useContext(LoginContext);
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("")
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")

	// Toast functions
	const notifyA = (msg) => toast.error(msg)
	const notifyB = (msg) => toast.success(msg)

	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

	const postData = () => {
		//checking email
		if (!emailRegex.test(email)) {
			notifyA("Invalid email")
			return
		} else if (!passRegex.test(password)) {
			notifyA("Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!")
			return
		}

		// Sending data to server
		fetch("https://socialifyfrontend.onrender.com/signup", {
			method: "post",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name: name,
				userName: userName,
				email: email,
				password: password

			})
		}).then(res => res.json())
			.then(data => {
				if (data.error) {
					notifyA(data.error)
				} else {
					notifyB(data.message)
					navigate("/signin")
				}
				console.log(data)
			})
	}

	const socialAuth = async (credentials) => {
		console.log(credentials.credential);
		try {
			const res = await fetch("https://socialifyfrontend.onrender.com/social-auth", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					"oauth_token": credentials.credential
				})
			})
			const data = await res.json();
			localStorage.setItem("jwt", data.token)
			localStorage.setItem("user", JSON.stringify(data.user))

			setUserLogin(true)
			navigate("/")

		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<div class="container flex">
				<div class="facebook-page flex"></div>
				<div class="text">
					<h1 className="singh1">Socialify</h1>
					<p className="signp">
						Connect with friends and the world around you on Socialify.
					</p>
				</div>
				<div>
					<div className="formsection">
						<input
							type="email"
							className="inputsingin"
							name="email"
							id="email"
							value={email}
							placeholder="Email"
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
						<input
							type="text"
							className="inputsingin"
							name="name"
							id="name"
							placeholder="Full Name"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
							}}
						/>
						<input
							type="text"
							className="inputsingin"
							name="username"
							id="username"
							placeholder="Username"
							value={userName}
							onChange={(e) => {
								setUserName(e.target.value);
							}}
						/>
						<input
							type="password"
							className="inputsingin"
							name="password"
							id="password"
							placeholder="Password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>

						<GoogleLogin
							onSuccess={socialAuth}
							onError={() => {
								console.log("Login Failed");
							}}
						/>
						<p
							className="loginPara"
							style={{ fontSize: "12px", margin: "3px 0px" }}
						>
							By signing up, you agree to out Terms, <br /> privacy policy and
							cookies policy.
						</p>

						<div class="link">
							<input
								type="submit"
								className="inputsingin"
								style={{
									backgroundColor: "#0d65d9",
									color: "white",
									fontSize: "1.4rem",
									fontWeight: 500,
									cursor: "pointer",
								}}
								id="submit-btn"
								value="Sign Up"
								onClick={() => {
									postData();
								}}
							/>
						</div>
					</div>

					<div className="loginForm2">
						Already have an account ?
						<Link to="/signin">
							<span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
