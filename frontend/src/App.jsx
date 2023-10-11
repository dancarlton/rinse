import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import axios from "axios"

function App() {
	// TODO: Make this a slice action in userSlice.js.
	const [user, setUser] = useState(null);
	// const hook = () => {
	// 	console.log('effect')
	// 	axios
	// 		.get('http://localhost:5000/api/users')
	// 		.then(response => {
	// 			console.log('promise fulfilled')
	// 			setUser(response)
	// 		})
	// }
	// useEffect(hook, [])
	// console.log(user)

	return (
		<BrowserRouter>
			<div>
				<Header />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App;
