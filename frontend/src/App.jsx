import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"

function App() {
	// TODO: Make this a slice action in userSlice.js.
	const [user, setUser] = useState(null);
	useEffect(() => {
		const getUser = async () => {
			fetch("http://localhost:5000/api/auth/login/success", {
				method: "GET",
				credentials: "include",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": true
				}
			}).then(response => {
				if (response.status === 200) return response.json();
				throw new Error("authentication has been failed!")
			}).then(resObject => {
				setUser(resObject.user);
			}).catch(error => {
				console.error(error)
			})
		}
		getUser()
	}, [])
	console.log(user)

	return (
		<BrowserRouter>
		<div>
		<Header/>
		<Routes>
			<Route path="/" element={<HomePage/>} />
			<Route path="/login" element={user ? <Navigate to="/"/> : <LoginPage/>} />
		</Routes>
		</div>
		</BrowserRouter>
	)
}

export default App;
